Tasks packages to manage Azure DNS Zone Azure DevOps release pipeline.

Tasks provides:
- A Record Manager

This task package is compatible with:
- Hosted macOS build agent (supported)
- Hosted VS2017 (supported)
- Any private build agent with Powershell and Azure CLI installed


## Builds status
<table>
  <thead>
    <tr>
      <th>Branch</th>
      <th>Status</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Master</td>
      <td><img src="https://dev.azure.com/experta/ExpertaSolutions/_apis/build/status/AzureDNSZone-CI?branchName=master"/></td>
    <tr>
  </tbody>
</table>

## Release status
<table>
  <thead>
    <tr>
      <th>Release</th>
      <th>Status</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>QA</td>
      <td><img src="https://vsrm.dev.azure.com/experta/_apis/public/Release/badge/5b43050d-0a01-4269-ace5-9e22c920391c/12/40"/></td>
    </tr>
    <tr>
      <td>VS-Marketplace</td>
      <td><img src="https://vsrm.dev.azure.com/experta/_apis/public/Release/badge/5b43050d-0a01-4269-ace5-9e22c920391c/12/42"/></td>
    </tr>
  </tbody>
</table>

## A Record Manager (required parameters)
- Azure subscription
- Azure AD Admin user
- Azure AD Admin password
- Azure Resource Group
- Azure DNS Zone
- A record to manage
- IP Address

# Requirements

- Azure CLI must be installed on the build agent

# What's next
- Tasks Unit tests
- Tasks Integration tests
- DNS Zone Manager (Task to create DNS Zone in Azure)
