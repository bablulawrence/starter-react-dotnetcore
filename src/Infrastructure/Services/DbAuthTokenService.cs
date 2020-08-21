using System.Threading.Tasks;
using Microsoft.Azure.Services.AppAuthentication;

namespace StarterApp.Infrastructure.Services
{
    public class DbAuthTokenService : IDbTokenService
    {
        public async Task<string> GetToken()
        {
            AzureServiceTokenProvider provider = new AzureServiceTokenProvider();
            var token = await provider.GetAccessTokenAsync("https://database.windows.net/");
            return token;
        }
    }
}