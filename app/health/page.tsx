"use client";

import { useMemo, useState } from "react";
import AppointmentBooking from "@/components/health/AppointmentBooking";
import AppointmentHistory from "@/components/health/AppointmentHistory";
import PatientIntakeForm from "@/components/health/PatientIntakeForm";
import AppShell from "@/components/layout/AppShell";
import type { UserRole } from "@/lib/health/types";

export default function HealthPage() {
  const [role] = useState<UserRole>("patient");
  const [tenantId] = useState("tenant-demo-001");
  const [actorUserId] = useState("patient-demo-001");
  const [patientId] = useState("patient-demo-001");
  const [refreshToken, setRefreshToken] = useState(0);

  const roleDescription = useMemo(
    () =>
      role === "patient"
        ? "Patient-facing intake and appointment workflows with live activity tracking."
        : "Provider operations view for routing and appointment oversight.",
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
    <AppShell title="Healthcare Operations" subtitle={roleDescription} role={role} activeHref="/health">
      {role === "patient" ? (
        <div className="grid gap-6">
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
          </div>
          <AppointmentHistory
            role={role}
            patientId={patientId}
            requestHeaders={authHeaders}
            refreshToken={refreshToken}
          />
        </div>
      ) : (
        <AppointmentHistory
          role={role}
          patientId={patientId}
          requestHeaders={authHeaders}
          refreshToken={refreshToken}
        />
      )}
    </AppShell>
  );
}
