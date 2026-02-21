# AI Healthcare Appointment Kit

A Next.js + TypeScript starter for healthcare appointment booking, patient intake, and a non-diagnostic AI pre-visit triage assistant.

## Features

- Patient intake form with required consent flags
- Appointment booking and role-based appointment views (patient/provider)
- API routes for intake and appointment creation
- AI triage endpoint with strict emergency and safety messaging
- Privacy-first approach with in-memory storage by default (no persistent PHI database)

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env.local
```

Set `OPENAI_API_KEY` for live triage responses.

3. Run locally:

```bash
npm run dev
```

4. Open:

`http://localhost:3000/health`

## API Endpoints

- `POST /api/health/intake`
- `GET /api/health/intake?patientId=...`
- `POST /api/health/appointments`
- `GET /api/health/appointments?role=patient&patientId=...`
- `GET /api/health/appointments?role=provider`
- `POST /api/ai/triage-assistant`

## Privacy and Compliance Notes

- This kit uses in-memory stores (`lib/health/store.ts`) for demo safety.
- Do not deploy to production without:
  - authenticated access controls
  - authorization checks per role
  - encrypted data storage and transport
  - audit logging
  - legal/compliance review (HIPAA and local regulations)

See:

- `docs/SETUP.md`
- `docs/COMPLIANCE_DISCLAIMER_TEMPLATE.md`
