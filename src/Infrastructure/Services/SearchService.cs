using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;

namespace StarterApp.Infrastructure.Services
{
    public class SearchService : ISearchService
    {
        private SearchServiceClient _serviceClient;
        private ConcurrentDictionary<string, ISearchIndexClient> _indexClients;
        public SearchService(string accountName, string queryKey)
        {
            _serviceClient = new SearchServiceClient(accountName, new SearchCredentials(queryKey));
            _indexClients = new ConcurrentDictionary<string, ISearchIndexClient>();
        }
        private ISearchIndexClient GetClient(string indexName)
        {
            return _indexClients.GetOrAdd(indexName, _serviceClient.Indexes.GetClient(indexName));
        }

        public async Task<DocumentSearchResult<T>> SearchAsync<T>(string indexName,
                                                                  string searchText,
                                                                  SearchParameters parameters)
        {
            var indexClient = GetClient(indexName);
            return await indexClient.Documents.SearchAsync<T>(searchText, parameters);
        }

        public async Task<DocumentSearchResult<T>> SearchAsync<T>(string indexName,
                                                                  string searchText,
                                                                  string[] searchFields,
                                                                  string[] select)
        {
            var indexClient = GetClient(indexName);
            var parameters = new SearchParameters
            {
                SearchFields = searchFields,
                Select = select
            };
            return await indexClient.Documents.SearchAsync<T>(searchText, parameters);
        }

        public async Task DeleteIndexIfExistsAsync(string indexName)
        {

            if (_serviceClient.Indexes.Exists(indexName))
            {
                await _serviceClient.Indexes.DeleteAsync(indexName);
            }
        }

        public async Task<Index> CreateIndexAsync<T>(string indexName)
        {
            var definition = new Index()
            {
                Name = indexName,
                Fields = FieldBuilder.BuildForType<T>()
            };

            return await _serviceClient.Indexes.CreateAsync(definition);
        }

        public async Task<DocumentIndexResult> UploadDocumentsAsync<T>(string indexName, T[] documents)
        {
            var indexClient = GetClient(indexName);
            var batch = IndexBatch.Upload(documents);
            return await indexClient.Documents.IndexAsync(batch);
        }

        public async Task<DocumentIndexResult> DeleteDocumentsAsync<T>(string indexName, T[] documents)
        {
            var indexClient = GetClient(indexName);
            var batch = IndexBatch.Delete(documents);
            return await indexClient.Documents.IndexAsync(batch);
        }

        public async Task<DocumentIndexResult> MergeOrUploadDocumentsAsync<T>(string indexName, T[] documents)
        {
            var indexClient = GetClient(indexName);
            var actions = new IndexAction<T>[] { };
            foreach (var d in documents)
            {
                actions.Append(IndexAction.MergeOrUpload(d));
            }
            var batch = IndexBatch.New(actions);
            return await indexClient.Documents.IndexAsync(batch);
        }

        public bool CheckIndexExists(string indexName)
        {
            return _serviceClient.Indexes.Exists(indexName);
        }
    }
}