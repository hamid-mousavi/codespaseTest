using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System;
using System.Text;
using Coop.Infrastructure;
using Coop.Api;
using BC = BCrypt.Net.BCrypt;
using Coop.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Serilog
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();
builder.Host.UseSerilog();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\""
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference { Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new string[] { }
        }
    });
});

// Configuration: PostgreSQL
// Support both the environment-style key with double-underscores and the configuration-style key with colon.
var conn = builder.Configuration.GetValue<string>("POSTGRES:CONNECTION")
           ?? builder.Configuration.GetValue<string>("POSTGRES__CONNECTION")
           ?? Environment.GetEnvironmentVariable("POSTGRES__CONNECTION")
           ?? "Host=localhost;Database=coopdb;Username=coop;Password=coop";
builder.Services.AddDbContext<AppDbContext>(opt => 
    opt.UseNpgsql(conn)
);

// JWT
var jwtKey = builder.Configuration.GetValue<string>("JWT__KEY") ?? "ReplaceWithASecretKeyAtLeast32Chars";
var key = Encoding.ASCII.GetBytes(jwtKey);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

// DI for services
builder.Services.AddScoped<IAuthService, Coop.Api.Services.AuthService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IDebtGeneratorService, Coop.Api.Services.DebtGeneratorService>();
builder.Services.AddScoped<INotificationService, Coop.Api.Services.NotificationService>();
            builder.Services.AddScoped<IFileStorageService, LocalFileStorageService>();

// AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSerilogRequestLogging();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed admin user if not exists
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // For development/demo: create database schema if not exists. For production, prefer EF Migrations.
    db.Database.EnsureCreated();
    var adminUserId = Guid.Parse("22222222-2222-2222-2222-222222222222");
    var adminUser = db.Users.FirstOrDefault(u => u.Id == adminUserId);
    if (adminUser == null)
    {
        var adminRole = db.Roles.FirstOrDefault(r => r.Name == "Administrator") ?? 
            new Coop.Domain.Role { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Name = "Administrator" };
        
        if (adminRole.Id == Guid.Empty) db.Roles.Add(adminRole);

        // For dev: store plaintext password (fine for testing; in production use proper hashing)
        adminUser = new Coop.Domain.User
        {
            Id = adminUserId,
            Username = "admin",
            Email = "admin@coop.local",
            PasswordHash = "admin",
            Roles = new List<Coop.Domain.Role> { adminRole }
        };
        db.Users.Add(adminUser);
        await db.SaveChangesAsync();
        Log.Information("Admin user seeded successfully");
    }
    else if (adminUser.PasswordHash == "TODO_HASH" || string.IsNullOrEmpty(adminUser.PasswordHash))
    {
        // Update password if it's the placeholder (from migration seed data or if empty)
        adminUser.PasswordHash = "admin";
        db.Users.Update(adminUser);
        await db.SaveChangesAsync();
        Log.Information("Admin password updated from placeholder");
    }
}

app.Run();

// Service implementations are provided in the `Coop.Api.Services` namespace files.
