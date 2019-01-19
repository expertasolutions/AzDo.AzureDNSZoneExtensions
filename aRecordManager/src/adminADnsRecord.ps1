param (
  [Parameter(Mandatory=$true, Position=1)]
  [string]$subscriptionId
, [Parameter(Mandatory=$true, Position=2)]
  [string]$azureAdminUser
, [Parameter(Mandatory=$true, Position=3)]
  [string]$azureAdminPwd
, [Parameter(Mandatory=$true, Position=4)]
  [string]$resourceGroupName
, [Parameter(Mandatory=$true, Position=5)]
  [string]$domainName
, [Parameter(Mandatory=$true, Position=6)]
  [string]$aName
, [Parameter(Mandatory=$true, Position=7)]
  [string]$ipAddress
)

$loginResult = az login -u $azureAdminUser -p $azureAdminPwd

$domainInfo = az network dns record-set a list --resource-group $resourceGroupName --zone-name $domainName --subscription $subscriptionId | ConvertFrom-Json
$exists = $domainInfo | Where-Object { $_.name -eq $aName }
if($exists){
  write-host "'$($aName).$domainName' -> Current IP: '$($exists.arecords[0].ipv4Address)' vs New IP: '$($ipAddress)' ... " -NoNewline
  
  if($exists.arecords[0].ipv4Address -eq $ipAddress) {
    write-host "Nothing to change"  
  } else {
    $result = az network dns record-set a update --resource-group $resourceGroupName --zone-name $domainName --subscription $subscriptionId --name $aName --set "arecords[0].ipv4Address=$ipAddress" --force-string | ConvertFrom-Json
    write-host "Record updated !"
  }

} else {
  write-host "Creating '$($aName).$domainName' ... " -NoNewline
  $result = az network dns record-set a add-record --resource-group $resourceGroupName --zone-name $domainName --subscription $subscriptionId --record-set-name $aName --ipv4-address $ipAddress | ConvertFrom-Json
  write-host "Record created !";
}
$logoutResult = az logout