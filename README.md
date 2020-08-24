# A starter project template for React and .Net core MVC

## Deployment

### 1. Fork this repo

Fork this repo by clicking the `fork` button on the top-right of the repository page.

### 2. Create an Azure Resource Group

Create a resource group to provision the Azure resources - App Service, Search, Key Vault etc. required for the app. You can do this by running below Azure CLI command in Azure Cloud Shell.

`az group create --location <Your location> --name <Your resource group name>`

`e.g. az group create --location southeastasia --name starter-app`

### 2. Provision Azure resources

Go to `Actions` in your forked repository. You will find following workflows. These have a workflow_dispatch event trigger to allows them to be run manually. Please execute them

| Workflow                   | Description                                       |
| -------------------------- | ------------------------------------------------- |
| Provision Azure Resources  | Creates azure resources using ARM template        |
| Deploy web app             | Deploys the web app to Azure App Service          |
| Deploy database migrations | Applies database migrations to Azure Sql database |

1. Run `Provision Azure Resources` workflow to create azure by clicking `Run work flow` button on the right side of the workflow. You need to supply following parameter values.

   - Azure Resource Group Name: Name of the Azure Resource Group created in step 2.

   - App Name: Name of the app. This will be used as a prefix for Azure resource names.

   - Azure Active Directory object id for database admin user: Azure AD object id of the user who should have admin access on Azure SQL database. You can find this by navigating to Azure Active Directory -> Users in Azure Portal or running below command Azure CLI command.
     `az ad user show --id <User Principal Name> --query objectId --out tsv`

   e.g `az ad user show --id myuser@contoso.com --query objectId --out tsv`

## References
