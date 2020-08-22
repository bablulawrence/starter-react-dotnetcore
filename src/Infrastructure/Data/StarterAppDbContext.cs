using Microsoft.EntityFrameworkCore;
using StarterApp.Core.Entities;
using StarterApp.Infrastructure.Data.Configurations;
using Microsoft.Extensions.Configuration;
using Microsoft.Azure.Services.AppAuthentication;
using System;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore.Design;
using System.IO;
using Microsoft.Azure.KeyVault;
using Microsoft.Extensions.Configuration.AzureKeyVault;

namespace StarterApp.Infrastructure.Data
{
    public class StarterAppDbContext : DbContext
    {
        public DbSet<Item> Items { get; set; }
        public IConfiguration Configuration { get; }
        public StarterAppDbContext(DbContextOptions<StarterAppDbContext> options) : base(options)
        {
            var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            if (env != "Development")
            {
                var connection = (SqlConnection)Database.GetDbConnection();
                connection.AccessToken = (new AzureServiceTokenProvider())
                    .GetAccessTokenAsync("https://database.windows.net/").Result;
            }
        }

        public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<StarterAppDbContext>
        {
            public StarterAppDbContext CreateDbContext(string[] args)
            {

                var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

                IConfigurationBuilder config = new ConfigurationBuilder()
                        .SetBasePath(Directory.GetCurrentDirectory())
                        .AddJsonFile(@Directory.GetCurrentDirectory() + "/../Web/appsettings.json")
                        .AddEnvironmentVariables();

                var envAppSettingsFilePath = @Directory.GetCurrentDirectory() + $"/../Web/appsettings.{env}.json";
                if (File.Exists(envAppSettingsFilePath))
                {
                    config.AddJsonFile(envAppSettingsFilePath);
                }

                IConfigurationRoot builtConfig = config.Build();

                if (!String.IsNullOrEmpty(builtConfig["KeyVaultName"]))
                {
                    var azureServiceTokenProvider = new AzureServiceTokenProvider();
                    var keyVaultClient = new KeyVaultClient(
                        new KeyVaultClient.AuthenticationCallback(
                            azureServiceTokenProvider.KeyVaultTokenCallback));

                    config.AddAzureKeyVault(
                        $"https://{builtConfig["KeyVaultName"]}.vault.azure.net/",
                        keyVaultClient,
                        new DefaultKeyVaultSecretManager());
                }

                if (env == "Development")
                {
                    config.AddUserSecrets<DesignTimeDbContextFactory>();
                }

                IConfigurationRoot configuration = config.Build();

                var builder = new DbContextOptionsBuilder<StarterAppDbContext>();

                builder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));

                return new StarterAppDbContext(builder.Options);
            }
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new ItemConfiguration());
        }
    }
}