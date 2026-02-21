"use client";

import { useEffect, useState } from "react";

type Appointment = {
  id: string;
  patientId: string;
  providerName: string;
  appointmentDate: string;
  appointmentType: "in_person" | "telehealth";
  reason: string;
  status: "scheduled" | "completed" | "cancelled";
  createdAt: string;
};

type Props = {
  role: "patient" | "provider";
  patientId: string;
  refreshToken: number;
};

export default function AppointmentHistory({ role, patientId, refreshToken }: Props) {
  const [items, setItems] = useState<Appointment[]>([]);

  useEffect(() => {
    const scope = role === "provider" ? "provider" : `patient&patientId=${patientId}`;
    fetch(`/api/health/appointments?role=${scope}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.appointments ?? []);
      })
      .catch(() => setItems([]));
  }, [role, patientId, refreshToken]);

  return (
    <section className="panel grid">
      <h2>{role === "provider" ? "Provider Schedule View" : "My Appointments"}</h2>
      {items.length === 0 ? (
        <p className="muted">No appointments yet.</p>
      ) : (
        <div className="grid">
          {items.map((item) => (
            <article key={item.id} className="panel">
              <h3>{new Date(item.appointmentDate).toLocaleString()}</h3>
              <p>
                <strong>Provider:</strong> {item.providerName}
              </p>
              <p>
                <strong>Type:</strong> {item.appointmentType}
              </p>
              <p>
                <strong>Status:</strong> {item.status}
              </p>
              {role === "provider" ? (
                <p>
                  <strong>Patient ID:</strong> {item.patientId}
                </p>
              ) : null}
              <p>
                <strong>Reason:</strong> {item.reason}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
