"use client";

import { FormEvent, useState } from "react";

type Props = {
  patientId: string;
  onBooked: () => void;
};

export default function AppointmentBooking({ patientId, onBooked }: Props) {
  const [form, setForm] = useState({
    providerName: "",
    appointmentDate: "",
    appointmentType: "telehealth" as "telehealth" | "in_person",
    reason: ""
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    const res = await fetch("/api/health/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, ...form })
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not book appointment.");
      return;
    }

    setMessage("Appointment booked.");
    onBooked();
  }

  return (
    <form className="panel grid" onSubmit={onSubmit}>
      <h2>Book Appointment</h2>
      <label>
        Provider name
        <input
          value={form.providerName}
          onChange={(e) => setForm({ ...form, providerName: e.target.value })}
          required
        />
      </label>
      <label>
        Date and time
        <input
          type="datetime-local"
          value={form.appointmentDate}
          onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
          required
        />
      </label>
      <label>
        Appointment type
        <select
          value={form.appointmentType}
          onChange={(e) =>
            setForm({ ...form, appointmentType: e.target.value as "telehealth" | "in_person" })
          }
        >
          <option value="telehealth">Telehealth</option>
          <option value="in_person">In-person</option>
        </select>
      </label>
      <label>
        Reason
        <textarea
          rows={3}
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          required
        />
      </label>
      {message ? <div className="notice">{message}</div> : null}
      {error ? <div className="notice error">{error}</div> : null}
      <button type="submit">Create appointment</button>
    </form>
  );
}
