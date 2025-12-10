using Coop.Domain;
using Coop.Infrastructure;

namespace Coop.Api.Services
{
    public interface IPaymentService
    {
        Task<Guid> CreatePaymentAsync(Guid debtItemId, decimal amount, string method);
    }

    public class PaymentService : IPaymentService
    {
        private readonly AppDbContext _db;
        public PaymentService(AppDbContext db) { _db = db; }
        public async Task<Guid> CreatePaymentAsync(Guid debtItemId, decimal amount, string method)
        {
            var payment = new Payment { Id = Guid.NewGuid(), DebtItemId = debtItemId, Amount = amount, PaidAt = DateTime.UtcNow, Method = method };
            _db.Payments.Add(payment);
            await _db.SaveChangesAsync();
            return payment.Id;
        }
    }
}
