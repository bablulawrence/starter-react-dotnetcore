# A Starter template for React & ASP.NET Core App in Azure

Building a React & ASP.NET Core app and deploying to Azure is rather straight forward. However building one ready ready for production can become quite complicated because you might want to:

- Use additional services such as Azure Storage, Azure Search, Azure Redis cache and therefore need a scalable way to add the service APIs to your application code.
- Implement best practices for accessing these services from your app, such as Azure Managed Service Identity(MSI) and Azure Key Vault.
- Implement Authentication using Azure AD, Single Sign On(SSO), OpenId Connect, OAuth 2.0, MFA etc.
- Fully automate provisioning of Azure resources.
- Implement CI/CD.

This is a template app, created with the intent of solving some of these problems, helpful for quick starting React & ASP.NET development in Azure. The core domain is kept as plain CRUD, so that it can be refactored to into your app quickly. Here are the key features :

- Single Page Application using React UI and ASP.NET Core API.
- Entity Framework Core and code first migrations.
- Capable of performing basic CRUD operations against Azure SQL Server Database and Azure Blob Storage. i.e creating, listing, updating, and deleting a bunch of items with an attached file.
- Azure Search is used for searching items and Azure Redis Cache for server side caching.
- Services and dependency injection is used in the .NET Core API for encapsulating storage, search and cache features.
- Client side state management using React hooks, custom hook for Azure Blob Storage.
- No secrets, keys, passwords are stored in config files. API accesses Azure SQL Db and Storage Account using MSI. Azure Search and Redis Cache are accessed by key retrieved from Azure Key Vault which in turn is accessed using MSI. Client app access the Azure Blob Storage using SAS token provided by the API.
- Azure Active Directory, OpenId Connect, OAuth 2.0 and implicit grant flow is used for authentication.
- Azure AD Application Roles as used for assigning permission to uses.
- Deployment is fully automated using Github actions.

## Deploying the app to Azure

### 1. Fork this repo

Fork this repo by clicking the _fork_ button on the top-right of the repository page.

### 2. Create an Azure Resource Group

Create a resource group for holding Azure resources required for the app. You can do this by running below Azure CLI command in Azure Cloud Shell.

`az group create --location {location} --name {resource group name}`

example :

`az group create --location southeastasia --name starter-app`

### 3. Create a Service Principal for Azure deployment

Run below command to create a Service Principal scoped to the resource group created in [step 2](#2-create-an-azure-resource-group).

```azurecli
az ad sp create-for-rbac --name "StarterAppSP" \
--role contributor \
--scopes /subscriptions/{subscription id}/resourceGroups/{resource group name} \
--sdk-auth
```

example :

```azurecli
az ad sp create-for-rbac --name "StarterAppSP" \
--role contributor \
--scopes /subscriptions/1ee5ed92-933d-4c51-ac9f-96329a4273f7/resourceGroups/starter-app-rg
--sdk-auth
```

output will be like :

```azurecli
{
    "clientId": "<GUID>",
    "clientSecret": "<GUID>",
    "subscriptionId": "<GUID>",
    "tenantId": "<GUID>",
    (...)
}
```

hold on to this, you will need this in [step 6](#6-add-github-secrets).

### 4. Assign Azure AD Global Administrator Role to the Service Principal

Grant `Global Administrator` role to the Service Principal by following _Azure Active Directory -> Roles and administrators -> Global Administrator -> Add assignments_ in Azure Portal.

`Global Administrator` role is required for the workflow - [Create Azure Ad App Registrations](#7-run-github-workflows) which creates and configures the Azure AD app registrations. This workflow needs to be run only once; so you can remove the role assignment after it completes successfully. Conversely, If you don't have necessary privileges to assign the role, or you prefer not to do so for security reasons, you can run the Azure CLI commands in the [workflow file](.github/workflows/azure-ad.yml) directly.

### 5. Get Azure AD object id of the database admin user

Run the following command to get the Azure Active Directory object id of the user who should have admin access to the Azure SQL database.

`az ad user show --id {User Principal Name} --query objectId --out tsv`

example :

`az ad user show --id myuser@mydomain.com --query objectId --out tsv`

You can find this by following _Azure Active Directory -> Users_ in Azure Portal or running below command.

### 6. Add Github Secrets

Create the following secrets variables under your repository - _Settings -> Secrets_. The secret names should match exactly what is given below.

| #   | Secret Name                  | Description                                                                                                                   |
| --- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1   | APP_NAME_PREFIX              | Application name prefix. This will be used as a prefix for Azure resource names e.g. `Starter`                                |
| 2   | AZURE_CREDENTIALS            | Service Principal Details for deployment, [output of step 2](#3-create-a-service-principal-for-azure-deployment)              |
| 3   | AZURE_DB_ADMIN_AAD_OBJECT_ID | Azure AD Object Id of the Azure database admin user, [output of step 5](#5-get-azure-ad-object-id-of-the-database-admin-user) |
| 4   | AZURE_DB_ADMIN_USER          | User name of the Azure SQL database admin user e.g. `myuser@mydomain.com`                                                     |
| 5   | AZURE_DB_ADMIN_PASSWORD      | Password of the Azure database admin user                                                                                     |

### 7. Run Github workflows

Under `Actions` in your forked repository, you will find following workflows. Run them manually by clicking _workflow name -> run workflow_, in the sequence given below.

| #   | Workflow                          | Description                                       | Sequence    | Triggers                             |
| --- | --------------------------------- | ------------------------------------------------- | ----------- | ------------------------------------ |
| 1   | Create Azure Resources            | Provisions Azure resources                        | run first   | Manual                               |
| 2   | Create Azure Ad App Registrations | Registers AD Apps for API and Client in Azure AD  | run after 1 | Manual                               |
| 3   | Deploy Web App                    | Deploys the web app to Azure App Service          | run after 1 | Manual and web app code changes      |
| 4   | Deploy Database Migrations        | Applies database migrations to Azure Sql database | run after 1 | Manual and DB migration code changes |

You will get the url of the app from the output of step 1.

### 8. Assign Application Roles to Users

By default users can only view items but cannot create, modify or delete. Adding, updating and deleting items needs _Item Manager_ role. You can assign this role by following _Azure Active Directory -> Enterprise Applications( select Application Type "All Applications") -> Enter the API app name e.g. "Starter API App"> -> User and groups -> Add user -> Add assignment_ in Azure portal.

You can also do this by running following PowerShell command from Azure Cloud Shell.

```powershell
New-AzureADUserAppRoleAssignment `
-ObjectId  {Object id of the Users Service Principal} `
-Id {Object id of ItemManager Role} `
-PrincipalId {Object id of the Users Principal} `
-ResourceId {Object Id of the API App Service Principal}
```

## Running the app locally

### 1. Clone this repo

Clone this repo locally. e.g. `git clone git@github.com:bablulawrence/starter-react-dotnetcore.git`.

### 2. Setup development environment

You need below software and tools for ideal development experience :

- [.NET Core 3.1](https://dotnet.microsoft.com/download)
- [Node.js and npm](https://nodejs.org/en/download/)
- [Create React App](https://github.com/facebook/create-react-app)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/get-started/install/)
- [SQL Server or SQL Express](https://www.microsoft.com/en-gb/sql-server/sql-server-downloads)
- [Azure Storage Explorer](https://azure.microsoft.com/en-in/features/storage-explorer/)
- [Visual Studio Code or Visual Studio](https://visualstudio.microsoft.com/)

### 3. Update environment variable values and app settings

The [.env.development](/src/Web/ClientApp/.env.development) file holds the Azure AD details for the Client App. Similarly [appsettings.json](/src/Web/appsettings.json) and [appsettings.development.json](/src/Web/appsettings.development.json) together hold the values for the API app. Update all three files with Azure AD and Azure Resource details.

### 4. Running the app

Execute `dotnet run` from folder `/src/Web` to run the API app and `npm start` from folder `/src/Web/ClientApp` to run the Client App. You can also run them together from VS Code or Visual Studio.

To test the API app operations, you can use Postman, SoapUI, [VS Code REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) etc. Preferable way for generating an access token with necessary permissions for the API is to create a [Daemon app](https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-daemon-overview) to represent tool you want to use. Make sure to assign _ItemManager_ role to the Daemon app by following [step 8](#8-assign-application-roles-to-users). You might also be able to use user identities if you tool supports implicit grant flow.

Alternatively, you can also generate the access token by following Azure CLI command.

`az account get-access-token --resource {App id URI of the API app}`

example:

`az account get-access-token --resource https://starter-lgjsmbvlver5g-web-app.azurewebsites.net`. Subsequently you can use Curl, Postman etc. to invoke API operations by providing the access token in the call header.

By default Azure CLI wont have permission for the API. You will need to pre-authorize the Azure CLI on the API app to provide access. This can be done by following _Azure Active Directory -> App registrations -> Enter the API app name e.g. "Starter API App"> -> Expose an API -> Authorized client applications -> Add a client application -> Enter Client ID of Azure CLI in Azure Active Directory i.e 04b07795-8ddb-461a-bbee-02f9e1bf7b46 -> Select the scope StarterApp.ReadWrite_ in Azure portal.

## Reference

1. https://docs.microsoft.com/en-us/aspnet/core/client-side/spa/react?view=aspnetcore-3.1&tabs=visual-studio

2. https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-3.1

3. https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app

4. https://kentcdodds.com/blog/application-state-management-with-react/

5. https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage
