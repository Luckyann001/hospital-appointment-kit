"use client";

import { FormEvent, useState } from "react";
import Alert from "@/components/ui/Alert";
import Card from "@/components/ui/Card";

const providerOptions = ["Dr. Patel", "Dr. Morgan", "Dr. Lee", "Dr. Alvarez"];
const timeOptions = ["09:00", "10:30", "12:00", "14:00", "16:30"];

type Props = {
  patientId: string;
  requestHeaders: Record<string, string>;
  onBooked: () => void;
};

export default function AppointmentBooking({ patientId, requestHeaders, onBooked }: Props) {
  const [form, setForm] = useState({
    providerName: "",
    appointmentDate: "",
    preferredTime: "",
    appointmentType: "telehealth" as "telehealth" | "in_person"
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const appointmentDateTime = new Date(`${form.appointmentDate}T${form.preferredTime || "09:00"}:00`);

    const res = await fetch("/api/health/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...requestHeaders },
      body: JSON.stringify({
        patientId,
        providerName: form.providerName,
        appointmentDate: appointmentDateTime.toISOString(),
        appointmentType: form.appointmentType,
        reason: `${form.appointmentType === "telehealth" ? "Telehealth" : "In-person"} consultation`
      })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Could not book appointment.");
      return;
    }

    setMessage("Appointment booked.");
    onBooked();
  }

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white p-6">
      <form className="space-y-4" onSubmit={onSubmit}>
        <h2 className="text-4xl font-semibold text-slate-900">Book Appointment</h2>

        <div>
          <label className="label-base">Provider name</label>
          <select
            className="input-base"
            value={form.providerName}
            onChange={(e) => setForm({ ...form, providerName: e.target.value })}
            required
          >
            <option value="" disabled>
              Select provider
            </option>
            {providerOptions.map((provider) => (
              <option key={provider} value={provider}>
                {provider}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-base">Appointment date</label>
          <input
            className="input-base"
            type="date"
            value={form.appointmentDate}
            onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="label-base">Preferred time</label>
          <select
            className="input-base"
            value={form.preferredTime}
            onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
            required
          >
            <option value="" disabled>
              Select time
            </option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-base">Visit type</label>
          <select
            className="input-base"
            value={form.appointmentType}
            onChange={(e) =>
              setForm({ ...form, appointmentType: e.target.value as "telehealth" | "in_person" })
            }
          >
            <option value="telehealth">Telehealth</option>
            <option value="in_person">In-person</option>
          </select>
        </div>

        {message ? <Alert>{message}</Alert> : null}
        {error ? <Alert tone="error">{error}</Alert> : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-accent px-5 text-xl font-semibold text-white transition hover:bg-[#0b8f87] disabled:opacity-70"
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </Card>
  );
}
