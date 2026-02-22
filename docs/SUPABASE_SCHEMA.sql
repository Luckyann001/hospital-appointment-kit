create extension if not exists "pgcrypto";

create table if not exists patient_intakes (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null,
  patient_id text not null,
  full_name text not null,
  date_of_birth date not null,
  email text not null,
  phone text not null,
  preferred_language text not null,
  chief_concern text not null,
  symptom_duration_days integer not null check (symptom_duration_days >= 0),
  medications text not null default '',
  allergies text not null default '',
  conditions text not null default '',
  consent jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null,
  patient_id text not null,
  provider_name text not null,
  appointment_date timestamptz not null,
  appointment_type text not null check (appointment_type in ('in_person', 'telehealth')),
  reason text not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null,
  actor_id text not null,
  actor_role text not null,
  action text not null,
  resource_type text not null,
  resource_id text null,
  outcome text not null check (outcome in ('success', 'failure')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_patient_intakes_patient_id on patient_intakes(patient_id);
create index if not exists idx_patient_intakes_tenant_id on patient_intakes(tenant_id);
create index if not exists idx_patient_intakes_created_at on patient_intakes(created_at desc);
create index if not exists idx_appointments_patient_id on appointments(patient_id);
create index if not exists idx_appointments_tenant_id on appointments(tenant_id);
create index if not exists idx_appointments_created_at on appointments(created_at desc);
create index if not exists idx_appointments_date on appointments(appointment_date);
create index if not exists idx_audit_logs_tenant_id on audit_logs(tenant_id);
create index if not exists idx_audit_logs_created_at on audit_logs(created_at desc);
