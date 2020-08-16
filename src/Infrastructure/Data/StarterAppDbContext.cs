using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using StarterApp.Core.Entities;
using StarterApp.Infrastructure.Data.Configurations;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.AzureKeyVault;
using Microsoft.Azure.KeyVault;
using Microsoft.Azure.Services.AppAuthentication;

using System.IO;
using System;

namespace StarterApp.Infrastructure.Data
{
    public class StarterAppDbContext : DbContext
    {
        public StarterAppDbContext(DbContextOptions<StarterAppDbContext> options) : base(options)
        {
        }
        public DbSet<Item> Items { get; set; }

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
                builder.UseSqlServer($@"Server={configuration["AzureSqlDb:serverName"]};
                                Initial Catalog={configuration["AzureSqlDb:databaseName"]};
                                Persist Security Info=False;
                                User ID={configuration["AzureSqlDb:username"]};
                                Password={configuration["AzureSqlDb:password"]};
                                Encrypt=True;TrustServerCertificate=True;
                                Connection Timeout=30;");

                return new StarterAppDbContext(builder.Options);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new ItemConfiguration());
        }
    }
}