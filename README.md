# سیستم مدیریت بدهی و پرداخت تعاونی مسکن (CodespaseTest)

این مخزن شامل اسکلت یک پروژه کامل برای "سیستم مدیریت بدهی و پرداختی‌های یک تعاونی مسکن بزرگ" است. هدف این اسکلت فراهم آوردن پایه‌ای برای توسعه سریع یک MVP شامل بک‌اند (.NET 8)، فرانت‌اند (React + TypeScript + Vite)، دیتابیس (PostgreSQL)، کش (Redis)، و استقرار با Docker Compose است.

خلاصه کاری که این مخزن فراهم می‌کند:
- ساختار پوشه‌ها و پروژه‌ها برای Backend (Clean Architecture-like: Api, Application, Domain, Infrastructure)
- DbContext اولیه و مدل‌های داده
- نمونه Controllerها، DTOها و سرویس‌های اصلی
- JWT + Refresh Token scaffolding
- Serilog و Swagger
- اسکلت فرانت‌اند با React + TypeScript، Redux Toolkit و Material UI
- فایل‌های `docker-compose.yml` و `Dockerfile` برای هر بخش
- نمونه `.env.example` برای بک‌اند و فرانت

برای شروع سریع، به پوشه‌های `backend` و `frontend` مراجعه کنید:

- `backend` : پروژه‌های .NET (API, Application, Domain, Infrastructure)
- `frontend` : پروژه React + Vite

در ادامه راهنمای اجرای محلی و معماری خلاصه قرار دارد. فایل‌های بیشتر و اسناد API در پوشه‌های مرتبط است.

Quick start (docker):

```bash
# در شاخه ریشه
docker-compose up --build
```

برای توسعه محلی (نیاز به .NET 8 SDK و Node 18+):

```bash
# Backend
cd backend/src/Coop.Api
dotnet run

# Frontend
cd frontend
npm install
npm run dev
```

---
برای توضیحات بیشتر و مستندات API، فایل‌های `backend/README.md` و `frontend/README.md` را ببینید.