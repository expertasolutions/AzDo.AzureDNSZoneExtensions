Tasks packages to manage Azure DNS Zone Azure DevOps release pipeline.

Tasks provides:
- A Record Manager

This task package is compatible with:
- Hosted macOS build agent (supported)
- Hosted VS2017 (supported)
- Any private build agent with Powershell and Azure CLI installed

## Build status
- Dev branch: <img src="https://dev.azure.com/experta/ExpertaSolutions/_apis/build/status/AzureDNSZone-Dev-CI?branchName=Dev">
- Master branch: <img src="https://dev.azure.com/experta/ExpertaSolutions/_apis/build/status/AzureDNSZone-Master-CI?branchName=master">

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