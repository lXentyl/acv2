# ACV2 Print – Enterprise Print Operations Management Platform

Production-ready SaaS platform for print shop operations management.

## Architecture

- **Frontend:** React + Vite + TypeScript + TailwindCSS + ShadCN UI + Framer Motion
- **Backend:** NestJS + TypeScript + TypeORM + PostgreSQL
- **Auth:** JWT Access + Refresh tokens, bcrypt, role-based access
- **Multi-tenant:** Tenant ID isolation on all operational tables

## Quick Start

### 1. Docker (recommended)

```bash
cp .env.example .env
docker-compose up -d
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- PostgreSQL: localhost:5432

### 2. Manual Setup

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```

### 3. Database

The schema is auto-applied via Docker. For manual setup:

```bash
psql -U acv2admin -d acv2print < database/schema.sql
```

## Demo Credentials

- **Email:** admin@demo.com
- **Password:** Admin123!

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Register |
| POST | /api/auth/refresh | Refresh token |
| GET | /api/auth/profile | Current user |
| GET | /api/jobs | List jobs |
| POST | /api/jobs | Create job |
| PATCH | /api/jobs/:id/status | Update status |
| GET | /api/jobs/:id/history | Status history |
| GET | /api/materials | List materials |
| POST | /api/materials | Create material |
| POST | /api/materials/:id/movements | Record movement |
| GET | /api/materials/alerts | Low-stock alerts |
| GET | /api/audit-logs | Audit logs |
| GET | /api/activity | Activity stream |

## Project Structure

```
acv2-print/
├── frontend/          # React + Vite
│   └── src/
│       ├── api/       # Axios services
│       ├── components/# UI + layout
│       ├── pages/     # Route pages
│       ├── stores/    # Zustand
│       └── types/     # TypeScript
├── backend/           # NestJS
│   └── src/
│       ├── common/    # Guards, middleware, filters
│       └── modules/   # Auth, Jobs, Inventory, Audit, Activity
├── database/          # PostgreSQL schema
└── docker-compose.yml
```

## License

Proprietary – ACV2 Print © 2026
