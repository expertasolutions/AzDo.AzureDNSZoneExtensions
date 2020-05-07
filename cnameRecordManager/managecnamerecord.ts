import * as tl from 'azure-pipelines-task-lib/task';
import * as msRestNodeAuth from '@azure/ms-rest-nodeauth';
import * as dns from '@azure/arm-dns';

async function LoginToAzure(servicePrincipalId:string, servicePrincipalKey:string, tenantId:string) {
  return await msRestNodeAuth.loginWithServicePrincipalSecret(servicePrincipalId, servicePrincipalKey, tenantId );
};

async function run() {
  try {
    let azureEndpointSubscription = tl.getInput("azureSubscriptionEndpoint", true) as string;
    let resourceGroupName = tl.getInput("resourceGroupName", true) as string;
    let domainName = tl.getInput("domainName", true) as string;
    let cname = tl.getInput("cname", true) as string;
    let actionType = tl.getInput("actionType", true) as string;
    let inCreationMode = actionType === "createUpdate";

    let alias = tl.getInput("alias", inCreationMode) as string;
    let ttl = parseInt(tl.getInput("ttl", inCreationMode) as string);
    
    let subcriptionId = tl.getEndpointDataParameter(azureEndpointSubscription, "subscriptionId", false) as string;

    let servicePrincipalId = tl.getEndpointAuthorizationParameter(azureEndpointSubscription, "serviceprincipalid", false) as string;
    let servicePrincipalKey = tl.getEndpointAuthorizationParameter(azureEndpointSubscription, "serviceprincipalkey", false) as string;
    let tenantId = tl.getEndpointAuthorizationParameter(azureEndpointSubscription,"tenantid", false) as string;

    let metadataList = tl.getInput("metadataList", false) as string;
    if(metadataList === undefined) {
      metadataList = "";
    }
    
    console.log("SubscriptionId: " + subcriptionId);
    console.log("ServicePrincipalId: " + servicePrincipalId);
    console.log("ServicePrincipalKey: " + servicePrincipalKey);
    console.log("TenantId: " + tenantId);
    console.log("ResourceGroupName: " + resourceGroupName);
    console.log("ActionType: " + actionType);
    console.log("DomainName: " + domainName);
    console.log("CName: " + cname);
    console.log("Metadata: " + metadataList);

    if(inCreationMode === true) {
      console.log("Alias: " + alias);
      console.log("TTL: " + ttl);
    }

    console.log("");

    const azureCredentials = await LoginToAzure(servicePrincipalId, servicePrincipalKey, tenantId);
    const dnsClient = new dns.DnsManagementClient(azureCredentials, subcriptionId);

    if(actionType === "createUpdate") {
      let elms = metadataList.split(';');
      let mdString = undefined;
      for(let i=0;i<elms.length;i++) {
        let keyValue = elms[i].split('=');
        if(mdString === undefined) {
          mdString = "\"" + keyValue[0] + "\":\"" + keyValue[1] + "\"";
        } else {
          mdString += ",\"" + keyValue[0] + "\":\"" + keyValue[1] + "\"";
        }
      }

      let metadata = undefined;
      if(mdString !== undefined) {
        console.log("Metadata Object: " + mdString);
        metadata = JSON.parse("{" + mdString + "}");
      }

      const myRecord = { tTL: ttl, cnameRecord: { cname: alias }, metadata: metadata };   
      await dnsClient.recordSets.createOrUpdate(resourceGroupName, domainName, cname, "CNAME", myRecord);
      console.log('Record ' + cname + ' is set');
    } else if(actionType === "remove"){
      await dnsClient.recordSets.deleteMethod(resourceGroupName, domainName, cname, "CNAME");
      console.log('Record ' + cname + ' has been deleted');
    } else {
      throw new Error("Action type '" + actionType + "' not supported");
    }

  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
  }
}

run();