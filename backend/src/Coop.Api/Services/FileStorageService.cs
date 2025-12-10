using Microsoft.AspNetCore.Http;

namespace Coop.Api.Services
{
    public interface IFileStorageService
    {
        Task<string> SaveAsync(IFormFile file, string folder = "documents");
        Task<bool> DeleteAsync(string path);
        Task<Stream> GetAsync(string path);
    }

    public class LocalFileStorageService : IFileStorageService
    {
        private readonly string _basePath;
        private readonly ILogger<LocalFileStorageService> _logger;

        public LocalFileStorageService(IConfiguration config, ILogger<LocalFileStorageService> logger)
        {
            _basePath = config["FILE_STORAGE__BASE_PATH"] ?? "/app/storage";
            _logger = logger;
            if (!Directory.Exists(_basePath)) Directory.CreateDirectory(_basePath);
        }

        public async Task<string> SaveAsync(IFormFile file, string folder = "documents")
        {
            if (file == null || file.Length == 0) throw new ArgumentException("File is empty");
            var folderPath = Path.Combine(_basePath, folder);
            if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);
            var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
            var filePath = Path.Combine(folderPath, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create)) { await file.CopyToAsync(stream); }
            _logger.LogInformation($"File saved: {filePath}");
            return Path.Combine(folder, fileName);
        }

        public async Task<bool> DeleteAsync(string path)
        {
            var fullPath = Path.Combine(_basePath, path);
            if (!File.Exists(fullPath)) return false;
            File.Delete(fullPath);
            _logger.LogInformation($"File deleted: {fullPath}");
            return true;
        }

        public async Task<Stream> GetAsync(string path)
        {
            var fullPath = Path.Combine(_basePath, path);
            if (!File.Exists(fullPath)) throw new FileNotFoundException($"File not found: {path}");
            return File.OpenRead(fullPath);
        }
    }
}
