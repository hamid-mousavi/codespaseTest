namespace Coop.Api.Models
{
    public class ErrorResponse
    {
        public string Message { get; set; } = null!;
        public string? Details { get; set; }
    }
}
