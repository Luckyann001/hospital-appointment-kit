"use client";

import { useMemo, useState } from "react";
import AppointmentBooking from "@/components/health/AppointmentBooking";
import AppointmentHistory from "@/components/health/AppointmentHistory";
import PatientIntakeForm from "@/components/health/PatientIntakeForm";
import TriageAssistantPanel from "@/components/health/TriageAssistantPanel";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type { UserRole } from "@/lib/health/types";

export default function HealthPage() {
  const [role, setRole] = useState<UserRole>("patient");
  const [tenantId, setTenantId] = useState("tenant-demo-001");
  const [actorUserId, setActorUserId] = useState("patient-demo-001");
  const [patientId, setPatientId] = useState("patient-demo-001");
  const [refreshToken, setRefreshToken] = useState(0);

  const roleDescription = useMemo(
    () =>
      role === "patient"
        ? "Patient console: complete intake, run triage support, and schedule visits."
        : "Provider console: review active appointments and patient routing status.",
    [role]
  );

  const authHeaders = useMemo(
    () => ({
      "x-tenant-id": tenantId,
      "x-user-id": role === "patient" ? patientId : actorUserId,
      "x-user-role": role
    }),
    [actorUserId, patientId, role, tenantId]
  );

  return (
    <AppShell
      title="Healthcare Operations Dashboard"
      subtitle={roleDescription}
      role={role}
      activeHref="/health"
    >
      <div className="grid gap-6">
        <Card className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Tenant ID">
            <Input value={tenantId} onChange={(e) => setTenantId(e.target.value)} />
          </Field>
          <Field label="Role">
            <Select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              <option value="patient">Patient</option>
              <option value="provider">Provider</option>
            </Select>
          </Field>
          <Field label="Actor user ID">
            <Input value={actorUserId} onChange={(e) => setActorUserId(e.target.value)} />
          </Field>
          <Field label="Active patient ID">
            <Input value={patientId} onChange={(e) => setPatientId(e.target.value)} />
          </Field>
        </Card>

        {role === "patient" ? (
          <div className="grid gap-6 xl:grid-cols-2">
            <PatientIntakeForm
              patientId={patientId}
              requestHeaders={authHeaders}
              onSubmitted={() => setRefreshToken((v) => v + 1)}
            />
            <AppointmentBooking
              patientId={patientId}
              requestHeaders={authHeaders}
              onBooked={() => setRefreshToken((v) => v + 1)}
            />
            <TriageAssistantPanel patientId={patientId} requestHeaders={authHeaders} />
            <AppointmentHistory
              role={role}
              patientId={patientId}
              requestHeaders={authHeaders}
              refreshToken={refreshToken}
            />
          </div>
        ) : (
          <div className="grid gap-6">
            <AppointmentHistory
              role={role}
              patientId={patientId}
              requestHeaders={authHeaders}
              refreshToken={refreshToken}
            />
            <Card>
              <h2 className="text-xl font-semibold text-slate-900">Provider Notes</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                API access is now tenant-scoped and role-restricted with request-level audit logs.
                Integrate your identity provider and signed tokens before production deployment.
              </p>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
