# HR System MVP Monorepo

Production-minded MVP HR system with NestJS API + Next.js Web.

## Monorepo Structure
- `apps/api` – NestJS + Prisma + Postgres backend
- `apps/web` – Next.js App Router frontend
- `docker-compose.yml` – local Postgres

## Features
- Employee directory + profile updates with role-aware edit rules
- Leave management (apply, queue, approve/reject, balances)
- Attendance (clock in/out, recent history)
- Payroll basics (salary profile + payslip generation stub)
- Documents upload/download with guarded access and audit events
- Admin settings (departments, role assignment, leave policy listing)
- Audit logging for sensitive actions

## Security Notes
- JWT auth + refresh tokens
- Argon2 password hashing
- DTO input validation using `class-validator` + `ValidationPipe`
- RBAC enforced server-side via guards/decorators
- Rate limiting on auth login endpoint
- PII-safe logs (no sensitive values logged in plaintext)

## Local Setup
1. Start database:
   ```bash
   docker compose up -d
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. API env:
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```
4. Run Prisma migrations + seed:
   ```bash
   pnpm --filter api prisma:generate
   pnpm --filter api prisma:migrate --name init
   pnpm --filter api prisma:seed
   ```
5. Run both apps:
   ```bash
   pnpm dev
   ```

## URLs
- API: `http://localhost:4000`
- Swagger: `http://localhost:4000/docs`
- Web: `http://localhost:3000`

## Seed Accounts
Default password for all users: `Password123!`
- admin@startup.local (ADMIN)
- hr@startup.local (HR)
- manager@startup.local (MANAGER)
- employee1@startup.local (EMPLOYEE)
- employee2@startup.local (EMPLOYEE)

## Test Commands
```bash
pnpm --filter api test
pnpm --filter web test:e2e
```

## MVP Roadmap Next
- Multi-tenant org support + stronger secrets management (KMS)
- Real payroll cycle, statutory deductions, tax reports
- Leave calendar and conflict checks
- Signed URL/object storage (S3) for documents
- Full CI pipeline with SAST/dependency scanning
