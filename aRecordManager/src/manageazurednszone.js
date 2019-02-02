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

var tl = require('vsts-task-lib');
var shell = require('node-powershell');

try {
    
    var azureEndpointSubscription = tl.getInput("azureSubscriptionEndpoint", true);
    var adminuser = tl.getInput("azadadminuser", true);
    var adminpwd = tl.getInput("azadadminpwd", true);
    var resourceGroupName = tl.getInput("resourceGroupName", true);
    var domainName = tl.getInput("domainName", true);
    var aName = tl.getInput("aName", true);
    var ipAddress = tl.getInput("ipAddress", true);
    
    var subcriptionId = tl.getEndpointDataParameter(azureEndpointSubscription, "subscriptionId", false);

    var servicePrincipalId = tl.getEndpointAuthorizationParameter(azureEndpointSubscription, "serviceprincipalid", false);
    var servicePrincipalKey = tl.getEndpointAuthorizationParameter(azureEndpointSubscription, "serviceprincipalkey", false);
    var tenantId = tl.getEndpointAuthorizationParameter(azureEndpointSubscription,"tenantid", false);

    console.log("SubscriptionId: " + subcriptionId);
    console.log("AdminAdUser: " + adminuser);
    console.log("AdminAdPwd: " + adminpwd);
    console.log("ResourceGroupName: " + resourceGroupName);
    console.log("DomainName: " + domainName);
    console.log("A Name: " + aName);
    console.log("Ip Address: " + ipAddress);
    console.log("ServicePrincipalId: " + servicePrincipalId);
    console.log("ServicePrincipalKey: " + servicePrincipalKey);
    console.log("TenantId: " + tenantId);
    
    var pwsh = new shell({
        executionPolicy: 'Bypass',
        noProfile: true
    });
    
    pwsh.addCommand(__dirname  + "/adminADnsRecord.ps1 -subscriptionId '" + subcriptionId
        + "' -azureAdminUser '" + adminuser + "' -azureAdminPwd '" + adminpwd 
        + "' -resourceGroupName '" + resourceGroupName + "' -domainName '" + domainName 
        + "' -aName '" + aName + "' -ipAddress '" + ipAddress 
        + "' -servicePrincipalId '" + servicePrincipalId + "' -servicePrincipalKey '" + servicePrincipalKey
        + "' -tenantId '" + tenantId + "'")
        .then(function() {
            return pwsh.invoke();
        }).then(function(output){
            console.log(output);
            pwsh.dispose();
        }).catch(function(err){
            console.log(err);
            tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
            pwsh.dispose();
        });
} catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
}