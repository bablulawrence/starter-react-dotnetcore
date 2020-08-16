# Execute Sql Script in Azure SQL Db
Select-AzSubscription -SubscriptionId c70cf1d8-50bd-486d-b921-b910ffb03a70
$serverName = "sqldbserver"
$resourceGroupName = "rg-starter"
$ruleName = "landscape"
$ipAddressStart = Invoke-RestMethod http://ipinfo.io/json | Select-Object -exp ip
$ipAddressEnd = $ipAddressStart
Write-Host $ipAddressStart

Set-AzSqlServerFirewallRule -FirewallRuleName $ruleName `
    -StartIpAddress $ipAddressStart `
    -EndIpAddress $ipAddressEnd `
    -ServerName $serverName `
    -ResourceGroupName $resourceGroupName
							
Remove-AzSqlServerFirewallRule -FirewallRuleName $ruleName `
    -ServerName $serverName `
    -ResourceGroupName $resourceGroupName
							
$sqlLogin = "appuser"
$sqlDatabaseName = "sqldbsever"
$serverInstance = "sqldb.database.windows.net"
$sqlPassword = ""
$sql = "SELECT 'Hello world'"

Invoke-Sqlcmd -ServerInstance $serverInstance -Database $sqlDatabaseName -Username $sqlLogin -Password $sqlPassword -Query $sql

#Azure AD role assignment
Connect-AzureAD -TenantId 0b55e01a-573a-4060-b656-d1a3d5815791

New-AzureADServiceAppRoleAssignment -ObjectId  <Object id of the client app service Principal> `
	-Id <Id of the app role> `
	-PrincipalId <Object id of the client app service Principal> `
-ResourceId <Object Id of the API app service principal>

