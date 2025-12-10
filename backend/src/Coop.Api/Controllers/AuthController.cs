using Microsoft.AspNetCore.Mvc;
using Coop.Application.DTOs;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;

namespace Coop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _cfg;
        public AuthController(IConfiguration cfg)
        {
            _cfg = cfg;
        }

        [HttpPost("login")]
        public ActionResult<AuthResponse> Login([FromBody] AuthRequest req)
        {
            // NOTE: This is a stub. Replace with real validation + hashing.
            if (req.Username != "admin" || req.Password != "admin") return Unauthorized();

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_cfg.GetValue<string>("JWT__KEY") ?? "ReplaceWithASecretKeyAtLeast32Chars");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, "admin"), new Claim(ClaimTypes.Role, "Administrator") }),
                Expires = DateTime.UtcNow.AddMinutes(60),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var accessToken = tokenHandler.WriteToken(token);
            var refreshToken = Guid.NewGuid().ToString();

            return Ok(new AuthResponse(accessToken, refreshToken, tokenDescriptor.Expires!.Value));
        }
    }
}
