using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Coop.Application.DTOs;
using Coop.Api.Services;

namespace Coop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] AuthRequest req)
        {
            var result = await _authService.LoginAsync(req.Username, req.Password);
            if (result == null) return Unauthorized(new { error = "Invalid credentials" });

            var (accessToken, refreshToken, expiresAt) = result.Value;
            return Ok(new AuthResponse(accessToken, refreshToken, expiresAt));
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<AuthResponse>> Refresh([FromBody] RefreshRequest req)
        {
            var result = await _authService.RefreshTokenAsync(req.Token);
            if (result == null) return Unauthorized(new { error = "Invalid refresh token" });

            var (accessToken, refreshToken, expiresAt) = result.Value;
            return Ok(new AuthResponse(accessToken, refreshToken, expiresAt));
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout([FromBody] RefreshRequest req)
        {
            await _authService.RevokeTokenAsync(req.Token);
            return Ok();
        }
    }
}

public record RefreshRequest(string Token);
