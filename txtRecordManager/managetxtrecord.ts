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
    let txt = tl.getInput("txt", true) as string;
    let txtValue = tl.getInput("value", true) as string;
    let actionType = tl.getInput("actionType", true) as string;
    let ttl = parseInt(tl.getInput("ttl", true) as string);
    
    let subcriptionId = tl.getEndpointDataParameter(azureEndpointSubscription, "subscriptionId", false) as string;

    let servicePrincipalId = tl.getEndpointAuthorizationParameter(azureEndpointSubscription, "serviceprincipalid", false) as string;
    let servicePrincipalKey = tl.getEndpointAuthorizationParameter(azureEndpointSubscription, "serviceprincipalkey", false) as string;
    let tenantId = tl.getEndpointAuthorizationParameter(azureEndpointSubscription,"tenantid", false) as string;

    console.log("SubscriptionId: " + subcriptionId);
    console.log("ServicePrincipalId: " + servicePrincipalId);
    console.log("ServicePrincipalKey: " + servicePrincipalKey);
    console.log("TenantId: " + tenantId);
    console.log("ResourceGroupName: " + resourceGroupName);
    console.log("ActionType: " + actionType);
    console.log("DomainName: " + domainName);
    console.log("TXT: " + txt);
    console.log("Value: " + txtValue);
    console.log("TTL: " + ttl);
    console.log("");

    const azureCredentials = await LoginToAzure(servicePrincipalId, servicePrincipalKey, tenantId);
    const dnsClient = new dns.DnsManagementClient(azureCredentials, subcriptionId);

    if(actionType === "CreateUpdate") {
      var txtValues = txtValue.split('\n');
      console.log("txtValues: " + txtValues.length);

      const myRecord = { tTL: ttl, txtRecords: [{ value: txtValues }] };
      await dnsClient.recordSets.createOrUpdate(resourceGroupName, domainName, txt, "TXT", myRecord);
      console.log('Record ' + txt + ' is set');
    } else if(actionType === "Remove"){
      await dnsClient.recordSets.deleteMethod(resourceGroupName, domainName, txt, "TXT");
      console.log('Record ' + txt + ' has been deleted');
    } else {
      throw new Error("Action type '" + actionType + "' not supported");
    }

  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
  }
}

run();