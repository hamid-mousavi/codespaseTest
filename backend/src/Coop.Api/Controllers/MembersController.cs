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
    public class MembersController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;
        public MembersController(AppDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll(int page = 1, int pageSize = 20)
        {
            var q = _db.Members.AsNoTracking().OrderBy(m => m.FullName);
            var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            var dtos = items.Select(m => _mapper.Map<MemberDto>(m));
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> Get(Guid id)
        {
            var member = await _db.Members.Include(m => m.Units).FirstOrDefaultAsync(m => m.Id == id);
            if (member == null) return NotFound();
            return Ok(_mapper.Map<MemberDto>(member));
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Create([FromBody] MemberCreateDto dto)
        {
            var e = _mapper.Map<Member>(dto);
            e.Id = Guid.NewGuid();
            _db.Members.Add(e);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = e.Id }, _mapper.Map<MemberDto>(e));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Update(Guid id, [FromBody] MemberCreateDto dto)
        {
            var member = await _db.Members.FirstOrDefaultAsync(m => m.Id == id);
            if (member == null) return NotFound();

            _mapper.Map(dto, member);
            await _db.SaveChangesAsync();
            return Ok(_mapper.Map<MemberDto>(member));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var member = await _db.Members.FirstOrDefaultAsync(m => m.Id == id);
            if (member == null) return NotFound();

            _db.Members.Remove(member);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
