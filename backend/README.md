# Backend - Coop (ASP.NET Core)

این پوشه شامل اسکلت Backend با معماری Clean-ish و ماژولار است:

- `Coop.Api` (Web API)
- `Coop.Application` (DTOs, Handlers, Services interfaces)
- `Coop.Domain` (Entities, Value Objects)
- `Coop.Infrastructure` (EF Core DbContext, Repositories, External Integrations)

ویژگی‌های اصلی پیاده‌سازی‌شده در این اسکلت:
- JWT Authentication + Refresh Token flow
- EF Core (PostgreSQL) DbContext و مدل‌های پایه
- Serilog
- Swagger / OpenAPI

برای اجرا:

```bash
cd backend/src/Coop.Api
dotnet run
```

تنظیمات محیطی در `../.env.example` قرار دارند.
Database Migrations:

```bash
# from backend/src/Coop.Api
dotnet tool install --global dotnet-ef --version 8.0.0
dotnet ef migrations add InitialCreate -p ../Coop.Infrastructure -s . -o ../Migrations
dotnet ef database update -p ../Coop.Infrastructure -s .
```

در محیط docker-compose می‌توانید پس از بالا آمدن سرویس‌ها از همان دستورات برای اعمال migration استفاده کنید یا از Dockerfile و یک ابزار CI استفاده کنید.

برای مقداردهی اولیه (admin): فایل `AppDbContext` یک seed ساده قرار داده است که در صورت اعمال migration مقادیر اولیه اضافه خواهند شد (PasswordHash به صورت placeholder است؛ حتماً یک hash معتبر در production قرار دهید).
