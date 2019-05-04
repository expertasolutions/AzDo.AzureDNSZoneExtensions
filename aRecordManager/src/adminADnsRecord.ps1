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
  [string]$aName
, [Parameter(Mandatory=$true, Position=9)]
  [string]$ipAddress
, [Parameter(Mandatory=$true, Position=10)]
  [string]$ttl
)

$loginResult = az login --service-principal -u $servicePrincipalId -p $servicePrincipalKey --tenant $tenantId
$setSubResult = az account set --subscription $subscriptionId

$domainInfo = az network dns record-set a list --resource-group $resourceGroupName --zone-name $domainName --subscription $subscriptionId | ConvertFrom-Json
$exists = $domainInfo | Where-Object { $_.name -eq $aName }

if($actionType -eq "createUpdate") {
  if($exists){
    write-host "'$($aName).$domainName' -> Current IP: '$($exists.arecords[0].ipv4Address)' vs New IP: '$($ipAddress)' ... " -NoNewline
    
    if($exists.arecords[0].ipv4Address -eq $ipAddress -or $exists.ttl -eq $ttl) {
      write-host "Nothing to change"  
    } else {
      $result = az network dns record-set a update --resource-group $resourceGroupName --zone-name $domainName --subscription $subscriptionId --name $aName --set "arecords[0].ipv4Address=$ipAddress,ttl=$ttl" --force-string | ConvertFrom-Json
      write-host "Record updated !"
    }
  } else {
    write-host "Creating '$($aName).$domainName' ... " -NoNewline
    $result = az network dns record-set a add-record --resource-group $resourceGroupName --zone-name $domainName --subscription $subscriptionId --record-set-name $aName --ipv4-address $ipAddress | ConvertFrom-Json
    $result = az network dns record-set a update --resource-group $resourceGroupName --zone-name $domainName --subscription $subscriptionId --name $aName --set "ttl=$ttl" --force-string | ConvertFrom-Json
    write-host "Record created !";
  }
} elseif($actionType -eq "remove") {
  if($exists){
    write-host "Removing '$($aName).$domainName' with IP '$($exists.arecords[0].ipv4Address)' ... " -NoNewline
    $result = az network dns record-set a delete --resource-group $resourceGroupName --zone-name $domainName --subscription $subscriptionId --name $aName --yes
    write-host "Done"
  } else {
    write-host "'$($aName).$domainName' not existing..."
  }
}


$logoutResult = az account clear
