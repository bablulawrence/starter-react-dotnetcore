# A starter template for React and ASP.NET core SPA

Starter template for setting up a React and ASP.NET core SPA application in Azure.

- The app is capable of performing basic CRUD operations against Azure SQL Server Database and Azure Blob Storage.
- Azure Search and Azure Redis Cache is used for providing search and server side caching.
- Azure Active Directory is used for authentication.
- Deployment is fully automated using Github actions.

## Deployment

### 1. Fork this repo

Fork this repo by clicking the `fork` button on the top-right of the repository page.

### 2. Create an Azure Resource Group

Create a resource group to deploy Azure resources required for the app. You can do this by running below Azure CLI command in Azure Cloud Shell.

`az group create --location <Your location> --name <Your resource group name>`

`e.g. az group create --location southeastasia --name starter-app`

### 3. Get Azure Active Directory object id for database admin user

Azure AD object id of the user who should have admin access on Azure SQL database. You can find this by navigating to Azure Active Directory -> Users in Azure Portal or running below command Azure CLI command.
`az ad user show --id <User Principal Name> --query objectId --out tsv`

e.g `az ad user show --id myuser@contoso.com --query objectId --out tsv`

### 4. Add Github Secrets

| #   | Secret Name                  | Description                                                                                    |
| --- | ---------------------------- | ---------------------------------------------------------------------------------------------- |
| 1   | AZURE_CREDENTIALS            | Service Principal Details for deployment                                                       |
| 2   | APP_NAME_PREFIX              | Application name prefix. This will be used as a prefix for Azure resource names e.g. `Starter` |
| 3   | AZURE_DB_ADMIN_USER          | User name of the Azure SQL database admin user                                                 |
| 4   | AZURE_DB_ADMIN_AAD_OBJECT_ID | Azure AD Object Id of the Azure database admin user                                            |
| 5   | AZURE_DB_ADMIN_PASSWORD      | Password of the Azure database admin user                                                      |

### 5. Run Github workflows

Go to `Actions` in your forked repository. You will find following workflows. You can run them manually using the workflow_dispatch event triggers.

| #   | Workflow                          | Description                                       | Sequence | Triggers                        |
| --- | --------------------------------- | ------------------------------------------------- | -------- | ------------------------------- |
| 1   | Create Azure Resources            | Creates azure resources using ARM template        | first    | Manual                          |
| 2   | Create Azure Ad App Registrations | Register API and Client Apps in Azure AD          | after 1  | Manual                          |
| 3   | Deploy web app                    | Deploys the web app to Azure App Service          | after 1  | Manual and Web app changes      |
| 4   | Deploy database migrations        | Applies database migrations to Azure Sql database | after 1  | Manual and DB migration changes |

## 6. References

1. https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app
