using AutoMapper;
using StarterApp.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.AzureAD.UI;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using StarterApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using StarterApp.Infrastructure.Services.Models;
using System;

namespace StarterApp.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddApplicationInsightsTelemetry();

            services.AddAuthentication(AzureADDefaults.JwtBearerAuthenticationScheme)
                    .AddAzureADBearer(options => Configuration.Bind("AzureAd", options));

            services.AddDbContext<StarterAppDbContext>(options =>
                        options.UseSqlServer($@"Server={Configuration["AzureSqlDb:serverName"]};
                                Initial Catalog={Configuration["AzureSqlDb:databaseName"]};
                                Persist Security Info=False;
                                User ID={Configuration["AzureSqlDb:username"]};
                                Password={Configuration["AzureSqlDb:password"]};
                                Encrypt=True;TrustServerCertificate=True;
                                Connection Timeout=30;"));

            services.AddAutoMapper(typeof(StarterApp.Infrastructure.Services.Mappings.MappingProfile),
                                    typeof(StarterApp.Web.Mappings.MappingProfile));

            services.AddStackExchangeRedisCache(option =>
            {
                option.Configuration = $@"{Configuration["RedisCache:clientName"]},
                                        password={Configuration["RedisCache:key"]},
                                        ssl=True,abortConnect=False";
            });

            services.AddSingleton<ISearchService>(new SearchService(Configuration["AzureSearch:accountName"],
                                                    Configuration["AzureSearch:adminKey"]));
            services.AddSingleton<IStorageService>(new BlobStorageService(Configuration["AzureStorageAccount:accountName"],
                                                                          Configuration["AzureStorageAccount:accountKey"]));
            services.Configure<AzureEnvironment>(Configuration.GetSection("AzureEnvironment"));
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
