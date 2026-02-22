# Setup Guide

## Prerequisites

- Node.js 20+
- npm 10+
- Supabase project
- OpenAI API key

## Installation

```bash
npm install
cp .env.example .env.local
```

## Supabase Setup

1. Open Supabase SQL editor.
2. Run `docs/SUPABASE_SCHEMA.sql`.
3. Create a public storage bucket (default name: `genix-assets`).
4. Copy project URL + service role key into `.env.local`.

## Environment Variables

- `SUPABASE_URL`: required for persistent backend storage.
- `SUPABASE_SERVICE_ROLE_KEY`: required server-side key for API routes.
- `SUPABASE_STORAGE_BUCKET`: storage bucket for uploaded section images.
- `OPENAI_API_KEY`: required for live AI triage completion.
- `OPENAI_TRIAGE_MODEL`: optional, defaults to `gpt-4.1-mini`.
- `AUTH_JWT_ISSUER`: expected JWT issuer (optional).
- `AUTH_JWT_AUDIENCE`: expected JWT audience (optional).
- `AUTH_TENANT_CLAIM`: tenant claim name in JWT (default `tenant_id`).
- `AUTH_USER_CLAIM`: user claim name in JWT (default `sub`).
- `AUTH_ROLE_CLAIM`: role claim name in JWT (default `role`).
- `AUTH_JWT_HS256_SECRET`: optional HS256 secret for local test tokens.
- `ENABLE_HEADER_AUTH_FALLBACK`: allow `x-tenant-id/x-user-id/x-user-role` auth fallback.
- `ENABLE_DEMO_AUTH_FALLBACK`: set `true` for local demo auth fallback only.
- `DEMO_TENANT_ID`, `DEMO_USER_ID`, `DEMO_USER_ROLE`: local fallback auth identity.

## Run

```bash
npm run dev
npm run test
```

## Project Routes

- Main health page: `/health`
- Intake API: `/api/health/intake`
- Appointment API: `/api/health/appointments`
- Triage API: `/api/ai/triage-assistant`
- Upload API: `/api/media/upload`

## Auth / RBAC headers

Production callers should send a JWT access token:

- `Authorization: Bearer <token>`

Optional fallback (when `ENABLE_HEADER_AUTH_FALLBACK=true`):

- `x-tenant-id`
- `x-user-id`
- `x-user-role` (`patient` | `provider` | `admin`)

Access control and tenant isolation are enforced at API route level.

## Notes

- APIs automatically use Supabase when credentials are provided.
- If Supabase credentials are missing, intake and appointments fall back to in-memory demo storage.
- Write operations are rate-limited and emit audit log entries.
