using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Coop.Application.DTOs;
using Coop.Api.Services;

namespace Coop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _payments;
        public PaymentsController(IPaymentService payments) { _payments = payments; }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] PaymentCreateDto dto)
        {
            if (dto.Amount <= 0) return BadRequest(new { error = "Amount must be greater than zero" });

            var id = await _payments.CreatePaymentAsync(dto.DebtItemId, dto.Amount, dto.Method);
            return CreatedAtAction(nameof(GetById), new { id }, new PaymentDto(id, dto.DebtItemId, dto.Amount, DateTime.UtcNow, dto.Method, null));
        }

        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetById(Guid id)
        {
            // stub - return 404 for now
            return NotFound();
        }
    }
}
