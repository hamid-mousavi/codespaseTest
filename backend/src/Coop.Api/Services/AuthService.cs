using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using BC = BCrypt.Net.BCrypt;
using Coop.Domain;
using Coop.Infrastructure;

namespace Coop.Api.Services
{
    public interface IAuthService
    {
        Task<(string AccessToken, string RefreshToken, DateTime ExpiresAt)?> LoginAsync(string username, string password);
        Task<(string AccessToken, string RefreshToken, DateTime ExpiresAt)?> RefreshTokenAsync(string refreshToken);
        Task<bool> RevokeTokenAsync(string refreshToken);
    }

    public class AuthService : IAuthService
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;
        private readonly ILogger<AuthService> _logger;

        public AuthService(AppDbContext db, IConfiguration config, ILogger<AuthService> logger)
        {
            _db = db;
            _config = config;
            _logger = logger;
        }

        public async Task<(string AccessToken, string RefreshToken, DateTime ExpiresAt)?> LoginAsync(string username, string password)
        {
            var user = _db.Users.FirstOrDefault(u => u.Username == username);
            if (user == null)
            {
                _logger.LogWarning($"Login attempt for non-existent user: {username}");
                return null;
            }

            if (!BC.Verify(password, user.PasswordHash))
            {
                _logger.LogWarning($"Failed login for user: {username}");
                return null;
            }

            var accessToken = GenerateJwt(user);
            var refreshTokenStr = Guid.NewGuid().ToString();
            var refreshTokenEntity = new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = refreshTokenStr,
                ExpiresAt = DateTime.UtcNow.AddDays(int.Parse(_config["JWT__REFRESH_TOKEN_EXPIRE_DAYS"] ?? "30")),
                IsRevoked = false
            };

            _db.RefreshTokens.Add(refreshTokenEntity);
            await _db.SaveChangesAsync();

            var expiresAt = DateTime.UtcNow.AddMinutes(int.Parse(_config["JWT__ACCESS_TOKEN_EXPIRE_MINUTES"] ?? "60"));
            return (accessToken, refreshTokenStr, expiresAt);
        }

        public async Task<(string AccessToken, string RefreshToken, DateTime ExpiresAt)?> RefreshTokenAsync(string refreshTokenStr)
        {
            var refreshToken = _db.RefreshTokens.FirstOrDefault(rt => rt.Token == refreshTokenStr && !rt.IsRevoked);
            if (refreshToken == null || refreshToken.ExpiresAt < DateTime.UtcNow)
            {
                _logger.LogWarning($"Invalid refresh token");
                return null;
            }

            var user = await _db.Users.FindAsync(refreshToken.UserId);
            if (user == null) return null;

            var accessToken = GenerateJwt(user);
            var newRefreshTokenStr = Guid.NewGuid().ToString();
            var newRefreshToken = new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = newRefreshTokenStr,
                ExpiresAt = DateTime.UtcNow.AddDays(int.Parse(_config["JWT__REFRESH_TOKEN_EXPIRE_DAYS"] ?? "30")),
                IsRevoked = false
            };

            refreshToken.IsRevoked = true;
            _db.RefreshTokens.Add(newRefreshToken);
            await _db.SaveChangesAsync();

            var expiresAt = DateTime.UtcNow.AddMinutes(int.Parse(_config["JWT__ACCESS_TOKEN_EXPIRE_MINUTES"] ?? "60"));
            return (accessToken, newRefreshTokenStr, expiresAt);
        }

        public async Task<bool> RevokeTokenAsync(string refreshTokenStr)
        {
            var refreshToken = _db.RefreshTokens.FirstOrDefault(rt => rt.Token == refreshTokenStr);
            if (refreshToken == null) return false;

            refreshToken.IsRevoked = true;
            await _db.SaveChangesAsync();
            return true;
        }

        private string GenerateJwt(User user)
        {
            var key = Encoding.ASCII.GetBytes(_config["JWT__KEY"] ?? "ReplaceWithASecretKeyAtLeast32Chars");
            var tokenHandler = new JwtSecurityTokenHandler();
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(int.Parse(_config["JWT__ACCESS_TOKEN_EXPIRE_MINUTES"] ?? "60")),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
