using System;
using Azure;
using Azure.Storage.Blobs.Models;
using System.Threading.Tasks;

namespace StarterApp.Infrastructure.Services
{
    public interface IStorageService
    {
        Task<BlobContentInfo> UploadAsync(string containerName, string fileName, string localfilePath);
        // void UploadAsync(string containerName, string fileName, string localfilePath);
        Task DownloadAsync(string containerName, string fileName, string localfilePath);
        AsyncPageable<BlobItem> ListAsync(string containerName);
        Task<int> DeleteAsync(string containerName, string fileName);

        Task<bool> CheckBlobExists(string containerName, string fileName);
        Uri GetObjectUri(string containerName, string fileName, int permissions);
        string GetContainerKey(string containerName, int permissions = 1, int expireDurationInHours = 1);
    }
}