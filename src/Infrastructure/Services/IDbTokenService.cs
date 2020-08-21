using System.Threading.Tasks;
namespace StarterApp.Infrastructure.Services
{
    public interface IDbTokenService
    {
        Task<string> GetToken();
    }
}