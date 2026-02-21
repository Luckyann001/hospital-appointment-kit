"use client";

import { useMemo, useState } from "react";
import AppointmentBooking from "@/components/health/AppointmentBooking";
import AppointmentHistory from "@/components/health/AppointmentHistory";
import PatientIntakeForm from "@/components/health/PatientIntakeForm";
import TriageAssistantPanel from "@/components/health/TriageAssistantPanel";
import type { UserRole } from "@/lib/health/types";

export default function HealthPage() {
  const [role, setRole] = useState<UserRole>("patient");
  const [patientId, setPatientId] = useState("patient-demo-001");
  const [refreshToken, setRefreshToken] = useState(0);

  const roleDescription = useMemo(
    () =>
      role === "patient"
        ? "Patient view: submit intake, book visits, and review your appointments."
        : "Provider view: review appointment queue and patient IDs.",
    [role]
  );

  return (
    <main className="grid" style={{ paddingBottom: "2rem" }}>
      <section className="panel grid">
        <h1>Healthcare Appointment Kit</h1>
        <p className="muted">{roleDescription}</p>
        <div className="inline-row">
          <label>
            Role
            <select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              <option value="patient">Patient</option>
              <option value="provider">Provider</option>
            </select>
          </label>
          <label>
            Active patient ID
            <input value={patientId} onChange={(e) => setPatientId(e.target.value)} />
          </label>
        </div>
      </section>

      {role === "patient" ? (
        <section className="grid grid-2">
          <PatientIntakeForm
            patientId={patientId}
            onSubmitted={() => setRefreshToken((v) => v + 1)}
          />
          <AppointmentBooking patientId={patientId} onBooked={() => setRefreshToken((v) => v + 1)} />
          <TriageAssistantPanel patientId={patientId} />
          <AppointmentHistory role={role} patientId={patientId} refreshToken={refreshToken} />
        </section>
      ) : (
        <section className="grid">
          <AppointmentHistory role={role} patientId={patientId} refreshToken={refreshToken} />
          <div className="panel">
            <h2>Provider Notes</h2>
            <p className="muted">
              Intake and appointment APIs are role-agnostic in this template. Enforce authentication,
              authorization, and audit logging before production deployment.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
