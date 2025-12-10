using System;
using Coop.Domain;
using Coop.Infrastructure;

namespace Coop.Api.Services
{
    public interface IDebtGeneratorService
    {
        Task GenerateForPlanAsync(Guid planId);
        Task<Guid> CreatePlanAsync(string name);
    }

    public class DebtGeneratorService : IDebtGeneratorService
    {
        private readonly AppDbContext _db;
        private readonly ILogger<DebtGeneratorService> _logger;

        public DebtGeneratorService(AppDbContext db, ILogger<DebtGeneratorService> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task GenerateForPlanAsync(Guid planId)
        {
            var plan = await _db.DebtPlans.FindAsync(planId);
            if (plan == null)
            {
                _logger.LogWarning($"DebtPlan {planId} not found");
                return;
            }

            var units = _db.Units.ToList();
            var debtItems = new List<DebtItem>();

            foreach (var unit in units)
            {
                var existing = _db.DebtItems.FirstOrDefault(d => d.UnitId == unit.Id && d.DebtPlanId == planId);
                if (existing != null) continue;

                var amount = 100000M * (decimal)unit.OwnershipShare;
                var debtItem = new DebtItem
                {
                    Id = Guid.NewGuid(),
                    UnitId = unit.Id,
                    DebtPlanId = planId,
                    Amount = amount,
                    DueDate = DateTime.UtcNow.AddDays(30),
                    Paid = false
                };
                debtItems.Add(debtItem);
            }

            _db.DebtItems.AddRange(debtItems);
            await _db.SaveChangesAsync();
            _logger.LogInformation($"Generated {debtItems.Count} debt items for plan {planId}");
        }

        public async Task<Guid> CreatePlanAsync(string name)
        {
            var plan = new DebtPlan { Id = Guid.NewGuid(), Name = name, CreatedAt = DateTime.UtcNow };
            _db.DebtPlans.Add(plan);
            await _db.SaveChangesAsync();
            return plan.Id;
        }
    }
}
