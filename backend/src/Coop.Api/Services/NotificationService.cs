namespace Coop.Api.Services
{
    public interface INotificationService { Task SendAsync(string message, Guid? memberId = null); }
    public class NotificationService : INotificationService
    {
        private readonly ILogger<NotificationService> _logger;
        public NotificationService(ILogger<NotificationService> logger) { _logger = logger; }
        public Task SendAsync(string message, Guid? memberId = null)
        {
            _logger.LogInformation($"Notification to {memberId?.ToString() ?? "all"}: {message}");
            return Task.CompletedTask;
        }
    }
}
