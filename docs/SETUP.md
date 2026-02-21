# Setup Guide

## Prerequisites

- Node.js 20+
- npm 10+

## Installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Environment Variables

- `OPENAI_API_KEY`: required for live AI triage completion.
- `OPENAI_TRIAGE_MODEL`: optional, defaults to `gpt-4.1-mini`.

## Project Routes

- Main health page: `/health`
- Intake API: `/api/health/intake`
- Appointment API: `/api/health/appointments`
- Triage API: `/api/ai/triage-assistant`

## Deployment Hardening Checklist

- Add real authentication (patient/provider identities)
- Add authorization middleware for every health route
- Replace in-memory store with encrypted persistence
- Add consent record versioning and immutable audit logs
- Add monitoring and incident response runbook
