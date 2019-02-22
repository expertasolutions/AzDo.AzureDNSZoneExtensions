param (
  [Parameter(Mandatory=$true, Position=1)]
  [string]$subscriptionId
, [Parameter(Mandatory=$true, Position=2)]
  [string]$servicePrincipalId
, [Parameter(Mandatory=$true, Position=3)]
  [string]$servicePrincipalKey
, [Parameter(Mandatory=$true, Position=4)]
  [string]$tenantId
, [Parameter(Mandatory=$true, Position=5)]
  [string]$actionType
, [Parameter(Mandatory=$true, Position=6)]
  [string]$resourceGroupName
, [Parameter(Mandatory=$true, Position=7)]
  [string]$domainName
, [Parameter(Mandatory=$true, Position=8)]
  [string]$cname
, [Parameter(Mandatory=$true, Position=9)]
  [string]$alias
)

$loginResult = az login --service-principal -u $servicePrincipalId -p $servicePrincipalKey --tenant $tenantId
$setSubResult = az account set --subscription $subscriptionId

$domainInfo = az network dns record-set cname list --resource-group $resourceGroupName --zone-name $domainName --subscription $subscriptionId | ConvertFrom-Json
$exists = $domainInfo | Where-Object { $_.name -eq $cname }

if($actionType -eq "createUpdate") {
  if($exists){
    write-host "'$($cname).$domainName' -> Current ALIAS: '$($exists.cnameRecord[0].cname)' vs New Record: '$($alias)' ... " -NoNewline
    
    if($exists.cnameRecord[0].cname -eq $alias) {
      write-host "Nothing to change"  
    } else {
      #$result = az network dns record-set cname update --resource-group $resourceGroupName --zone-name $domainName --subscription $subscriptionId --name $cname --set "cnameRecord[0].cname=$alias" --force-string | ConvertFrom-Json
      write-host "Record updated !"
    }
  } else {
    write-host "Creating '$($cname).$domainName' ... " -NoNewline
    #$result = az network dns record-set cname create --resource-group $resourceGroupName --zone-name $domainName --subscription $subscriptionId --record-set-name $cname --ipv4-address $ipAddress | ConvertFrom-Json
    write-host "Record created !";
  }
} elseif($actionType -eq "remove") {
  if($exists){
    write-host "Removing '$($cname).$domainName' with Alias '$($exists.cnameRecord[0].cname)' ... " -NoNewline
    #$result = az network dns record-set cname delete --resource-group $resourceGroupName --zone-name $domainName --subscription $subscriptionId --name $cname --yes
    write-host "Done"
  } else {
    write-host "'$($cname).$domainName' not existing..."
  }
}

$logoutResult = az account clear