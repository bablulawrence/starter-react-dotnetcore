using Microsoft.Azure.Search.Models;
using System.Threading.Tasks;

namespace StarterApp.Infrastructure.Services
{
    public interface ISearchService
    {
        Task<DocumentSearchResult<T>> SearchAsync<T>(string indexName,
                                                     string searchText,
                                                     SearchParameters parameters);
        Task<DocumentSearchResult<T>> SearchAsync<T>(string indexName,
                                                                  string searchText,
                                                                  string[] searchFields,
                                                                  string[] select);
        Task DeleteIndexIfExistsAsync(string indexName);
        Task<Index> CreateIndexAsync<T>(string indexName);
        Task<DocumentIndexResult> UploadDocumentsAsync<T>(string indexName, T[] documents);
        Task<DocumentIndexResult> DeleteDocumentsAsync<T>(string indexName, T[] documents);
        Task<DocumentIndexResult> MergeOrUploadDocumentsAsync<T>(string indexName, T[] documents);
        bool CheckIndexExists(string indexName);
    }
}