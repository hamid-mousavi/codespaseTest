using Coop.Application.DTOs;
using Coop.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public ReportsController(AppDbContext db) { _db = db; }

        [HttpGet("debt-summary")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> DebtSummary()
        {
            var totalDebt = await _db.DebtItems.SumAsync(d => (decimal?)d.Amount) ?? 0M;
            var totalPaid = await _db.Payments.SumAsync(p => (decimal?)p.Amount) ?? 0M;
            var debtors = await _db.DebtItems.Where(d => !d.Paid).Select(d => d.UnitId).Distinct().CountAsync();

            var dto = new ReportDebtSummaryDto(totalDebt, totalPaid, debtors);
            return Ok(dto);
        }
    }
}
