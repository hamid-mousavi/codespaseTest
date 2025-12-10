using AutoMapper;
using Coop.Application.DTOs;
using Coop.Domain;
using Coop.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UnitsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;
        public UnitsController(AppDbContext db, IMapper mapper) { _db = db; _mapper = mapper; }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll(Guid? memberId = null)
        {
            var q = _db.Units.AsNoTracking().AsQueryable();
            if (memberId.HasValue) q = q.Where(u => u.MemberId == memberId.Value);
            var items = await q.ToListAsync();
            return Ok(items.Select(u => _mapper.Map<UnitDto>(u)));
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Create([FromBody] UnitCreateDto dto)
        {
            var e = _mapper.Map<Unit>(dto);
            e.Id = Guid.NewGuid();
            _db.Units.Add(e);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { id = e.Id }, _mapper.Map<UnitDto>(e));
        }
    }
}
