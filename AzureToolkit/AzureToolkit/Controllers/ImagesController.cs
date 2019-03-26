using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using AzureToolkit.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AzureToolkit.Controllers
{
    [Route("api/v1/images")]
    public class ImagesController : Controller
    {
        public class ImagePostRequest
        {
            public string UserId { get; set; }
            public string Description { get; set; }
            public string[] Tags { get; set; }
            public string URL { get; set; }
            public string Id { get; set; }
            public string EncodingFormat { get; set; }
        }

        public class SearchPersonDto
        {
            public string url { get; set; }
        }

        private CloudBlobContainer _container;
        private AzureToolkitContext _context;
        private IConfiguration _iconfig;

        public ImagesController(IConfiguration iconfig, AzureToolkitContext context)
        {
            this._context = context;
            this._iconfig = iconfig; 

            var storageAccount = new CloudStorageAccount(
                new Microsoft.WindowsAzure.Storage.Auth.StorageCredentials(
                    iconfig.GetValue<string>("StorageCredentials_AccountName"),
                    iconfig.GetValue<string>("StorageCredentials_KeyValue")
                    ),true);

            // Create a blob client.
            var blobClient = storageAccount.CreateCloudBlobClient();
            _container = blobClient.GetContainerReference("saveimages");
        }

        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet("{userId}")]
        public IActionResult GetImages(string userID)
        {
            var images = _context.SavedImages.Where(image => image.UserId == userID);
            return Ok(images);
        }

        [HttpGet("search/{userId}/{term}")]
        public IActionResult SearchImages(string userId, string term)
        {
            IActionResult result = null;
            try
            {
                string searchServiceName = this._iconfig.GetValue<string>("searchService_Name");
                string queryApiKey = this._iconfig.GetValue<string>("searchService_ApiKey");

                var indexClient = new SearchIndexClient(searchServiceName, "azuresql-index", new SearchCredentials(queryApiKey));

                var parameters = new SearchParameters() { Filter = string.Format("UserId eq '{0}'", userId) };
                DocumentSearchResult<SavedImage> results = indexClient.Documents.Search<SavedImage>(term, parameters);

                result = Ok(results.Results.Select((savedImage) => savedImage.Document));
            }
            catch (Exception e)
            {
                //TODO AddLogger 
                Console.WriteLine(e.Message);

                result = BadRequest(e.Message);

            }
            return result;
        }


        [HttpGet("searchPerson/{userId}")]
        public async Task<IActionResult> searchPerson(string userId)
        {
            IActionResult result = null;
            var imagelist = new List<SavedImage>();
            try
            {
                HttpClient client = new HttpClient();
                HttpResponseMessage response;

                client.DefaultRequestHeaders.Add(
                    "Ocp-Apim-Subscription-Key", this._iconfig.GetValue<string>("faceService_ApiKey"));

                foreach(var image in _context.SavedImages.Where(image => image.UserId == userId))
                {
                  
                    response = await client.PostAsJsonAsync(this._iconfig.GetValue<string>("faceService_Path"), new SearchPersonDto { url = image.StorageUrl });
                    string contentString = await response.Content.ReadAsStringAsync();

                    if (contentString.Contains("error"))
                        throw new Exception(contentString);
                        
                    if (contentString != "[]")
                            imagelist.Add(image);
                }
                result = Ok(imagelist);
            }
            catch (Exception e)
            {
                //TODO AddLogger 
                Console.WriteLine(e.Message);

                result = BadRequest(e.Message);

            }
            return result;
        }


        [HttpPost]
        public async Task<IActionResult> PostImage([FromBody]ImagePostRequest request)
        {
            System.IO.Stream stream = null;
            IActionResult result = Ok();
            try
            {
                var blockBlob = _container.GetBlockBlobReference(string.Format("{0}.{1}", request.Id, request.EncodingFormat));
                var aRequest = (HttpWebRequest)WebRequest.Create(request.URL);
                var aResponse = (await aRequest.GetResponseAsync()) as HttpWebResponse;

                stream = aResponse.GetResponseStream();
                await blockBlob.UploadFromStreamAsync(stream);

                var savedImage = new SavedImage
                {
                    UserId = request.UserId,
                    Description = request.Description,
                    StorageUrl = blockBlob.Uri.ToString(),
                    Tags = new List<SavedImageTag>()
                };
                
                foreach (var tag in request.Tags)
                {
                    savedImage.Tags.Add(new SavedImageTag{ Tag = tag });
                }

                _context.Add(savedImage);

                _context.SaveChanges();
            }
            catch (Exception e)
            {
                //TODO AddLogger 
                Console.WriteLine(e.Message);
                
                result = BadRequest();
                
            }
            finally
            {
                if (stream != null)
                    stream.Dispose();
                    stream.Close();
            }

            return result;
        }

    }
}
