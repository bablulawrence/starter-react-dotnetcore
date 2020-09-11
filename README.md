# A starter template for Azure Web App using React and .Net Core

Starter template for creating a Single Page Application using React, ASP.NET core and Azure.

- The app is capable of performing basic CRUD operations against Azure SQL Server Database and Azure Blob Storage.
- Azure Search and Azure Redis Cache is used for providing search and server side caching.
- Azure Active Directory is used for authentication.
- Deployment is fully automated using Github actions.

## Deployment

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
--role contributor --scopes /subscriptions/{subscription id}/resourceGroups/{resource group name} \
--sdk-auth
```

example :

```azurecli
az ad sp create-for-rbac --name "StarterAppSP" \
--role contributor --scopes /subscriptions/1ee5ed92-933d-4c51-ac9f-96329a4273f7/resourceGroups/starter-app-rg
--sdk-auth
```

The output will be like :

```azurecli
{
    "clientId": "<GUID>",
    "clientSecret": "<GUID>",
    "subscriptionId": "<GUID>",
    "tenantId": "<GUID>",
    (...)
}
```

hold on to this, you will need this [step 6](#6-add-github-secrets).

### 4. Assign Azure AD Global Administrator Role to the Service Principal

Grant `Global Administrator` role to the Service Principal by following _Azure Active Directory -> Roles and administrators -> Global Administrator -> Add assignments_ in Azure Portal.

`Global Administrator` role is required for the workflow - [Create Azure Ad App Registrations](#5-run-github-workflows) which creates and configures the Azure AD app registrations. This workflow needs to be run only once; so you can remove the role assignment after it completes successfully. Conversely, If you don't have necessary privileges to assign the role, or you prefer not to do so for security reasons, you can run the Azure CLI commands in the [workflow file](.github/workflows/azure-ad.yml) directly.

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

### 5. Run Github workflows

Under `Actions` in your forked repository, you will find following workflows. Run them manually by clicking _workflow name -> run workflow_, in the sequence given below.

| #   | Workflow                          | Description                                       | Sequence    | Triggers                             |
| --- | --------------------------------- | ------------------------------------------------- | ----------- | ------------------------------------ |
| 1   | Create Azure Resources            | Provisions Azure resources                        | run first   | Manual                               |
| 2   | Create Azure Ad App Registrations | Registers AD Apps for API and Client in Azure AD  | run after 1 | Manual                               |
| 3   | Deploy Web App                    | Deploys the web app to Azure App Service          | run after 1 | Manual and web app code changes      |
| 4   | Deploy Database Migrations        | Applies database migrations to Azure Sql database | run after 1 | Manual and DB migration code changes |

## 6. References

1. https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app
