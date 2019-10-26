"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });

var tl = require('azure-pipelines-task-lib');
const msRestAzure = require('ms-rest-azure');
const DnsManagementClient = require('azure-arm-dns');

try {
    
    var azureEndpointSubscription = tl.getInput("azureSubscriptionEndpoint", true);
    var resourceGroupName = tl.getInput("resourceGroupName", true);
    var domainName = tl.getInput("domainName", true);
    var cname = tl.getInput("cname", true);
    var alias = tl.getInput("alias", true);
    var actionType = tl.getInput("actionType", true);
    var ttl = parseInt(tl.getInput("ttl", true));
    
    var subcriptionId = tl.getEndpointDataParameter(azureEndpointSubscription, "subscriptionId", false);

    var servicePrincipalId = tl.getEndpointAuthorizationParameter(azureEndpointSubscription, "serviceprincipalid", false);
    var servicePrincipalKey = tl.getEndpointAuthorizationParameter(azureEndpointSubscription, "serviceprincipalkey", false);
    var tenantId = tl.getEndpointAuthorizationParameter(azureEndpointSubscription,"tenantid", false);

    console.log("SubscriptionId: " + subcriptionId);
    console.log("ServicePrincipalId: " + servicePrincipalId);
    console.log("ServicePrincipalKey: " + servicePrincipalKey);
    console.log("TenantId: " + tenantId);
    console.log("ResourceGroupName: " + resourceGroupName);
    console.log("ActionType: " + actionType);
    console.log("DomainName: " + domainName);
    console.log("CName: " + cname);
    console.log("Alias: " + alias);
    console.log("TTL: " + ttl);
    console.log("");
    
    msRestAzure.loginWithServicePrincipalSecret(
        servicePrincipalId, servicePrincipalKey, 
        tenantId, (err, creds) => {
            if(err){
                throw new Error('Auth error --> ' + err);
            }
            const client = new DnsManagementClient(creds, subcriptionId);
            if(actionType === "createUpdate"){
                const myRecord = {
                    tTL: ttl,
                    cnameRecords: [{ cname: alias }]
                };    
                return client.recordSets.createOrUpdate(resourceGroupName, domainName, aName, "CNAME", myRecord)
                        .then(result => {
                            console.log('Records ' + cName + ' is set');
                        }).catch(err=> {
                            tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
                        });
            } else if(actionType == "remove") {
                return client.recordSets.deleteMethod(resourceGroupName, domainName, aName, "CNAME")
                        .then(result => {
                            console.log('Record ' + cName + ' has been deleted');
                        }).catch(err=> {
                            tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
                        });

            }
        });
    
} catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
}