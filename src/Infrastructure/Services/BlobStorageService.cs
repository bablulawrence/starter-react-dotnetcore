using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System.Collections.Concurrent;
using System.IO;
using System.Threading.Tasks;
using System;
using Azure.Identity;
using Azure.Storage.Sas;
using Azure.Storage;

namespace StarterApp.Infrastructure.Services
{

    public class BlobStorageService : IStorageService
    {
        private readonly string _storageAccountName;
        private readonly string _storageAccountKey;

        private readonly BlobServiceClient _blobServiceClient;

        private ConcurrentDictionary<string, BlobContainerClient> _containerClients;
        public BlobStorageService(string accountName, string accountKey)
        {
            _storageAccountKey = accountKey;
            _storageAccountName = accountName;
            var connectionString = $"DefaultEndpointsProtocol=https;AccountName={accountName};" +
                                  $"AccountKey={accountKey};EndpointSuffix=core.windows.net";

            _blobServiceClient = new BlobServiceClient(connectionString);

            _containerClients = new ConcurrentDictionary<string, BlobContainerClient>();
        }

        private BlobContainerClient GetClient(string containerName)
        {
            return _containerClients.GetOrAdd(containerName, _blobServiceClient.GetBlobContainerClient(containerName));
        }


        public async Task<int> DeleteAsync(string containerName, string fileName)
        {
            var containerClient = GetClient(containerName);
            var blobClient = containerClient.GetBlobClient(fileName);
            var response = await blobClient.DeleteAsync();
            return response.Status;
        }

        public async Task<bool> CheckBlobExists(string containerName, string fileName)
        {
            var containerClient = GetClient(containerName);
            var blobClient = containerClient.GetBlobClient(fileName);
            return await blobClient.ExistsAsync();
        }

        public AsyncPageable<BlobItem> ListAsync(string containerName)
        {
            var containerClient = GetClient(containerName);
            return containerClient.GetBlobsAsync();
        }

        public async Task<BlobContentInfo> UploadAsync(string containerName, string fileName, string localFileName)
        {

            var containerClient = GetClient(containerName);
            var blobClient = containerClient.GetBlobClient(fileName);

            using FileStream uploadFileStream = File.OpenRead(localFileName);
            var response = await blobClient.UploadAsync(uploadFileStream);
            uploadFileStream.Close();
            return response.Value;
        }
        public async Task DownloadAsync(string containerName, string fileName, string localFilePath)
        {
            var containerClient = GetClient(containerName);
            var blobClient = containerClient.GetBlobClient(fileName);

            BlobDownloadInfo download = await blobClient.DownloadAsync();
            using FileStream downloadFileStream = File.OpenWrite(localFilePath);
            await download.Content.CopyToAsync(downloadFileStream);
        }

        public Uri GetObjectUri(string containerName,
                                string fileName,
                                int permissions = 1) //Default permission is read
        {

            BlobSasBuilder sasBuilder = new BlobSasBuilder()
            {
                BlobContainerName = containerName,
                BlobName = fileName,
                Resource = "b",
                StartsOn = DateTimeOffset.UtcNow,
                ExpiresOn = DateTimeOffset.UtcNow.AddHours(1)
            };
            sasBuilder.SetPermissions((BlobSasPermissions)permissions);
            var storageSharedKeyCredential = new StorageSharedKeyCredential(_storageAccountName,
                                                                            _storageAccountKey);
            string sasToken = sasBuilder.ToSasQueryParameters(storageSharedKeyCredential).ToString();

            UriBuilder fullUri = new UriBuilder()
            {
                Scheme = "https",
                Host = string.Format("{0}.blob.core.windows.net", _storageAccountName),
                Path = string.Format("{0}/{1}", containerName, fileName),
                Query = sasToken
            };
            return fullUri.Uri;
        }

        public string GetContainerKey(string containerName, int permissions = 1, int expireDurationInHours = 12) //Default permission is read
        {

            BlobSasBuilder sasBuilder = new BlobSasBuilder()
            {
                BlobContainerName = containerName,
                BlobName = String.Empty,
                Resource = "c",
                StartsOn = DateTimeOffset.UtcNow,
                ExpiresOn = DateTimeOffset.UtcNow.AddHours(expireDurationInHours)
            };
            sasBuilder.SetPermissions((BlobSasPermissions)permissions);
            var storageSharedKeyCredential = new StorageSharedKeyCredential(_storageAccountName,
                                                                            _storageAccountKey);
            string sasToken = sasBuilder.ToSasQueryParameters(storageSharedKeyCredential).ToString();

            return sasToken;
        }
    }
}