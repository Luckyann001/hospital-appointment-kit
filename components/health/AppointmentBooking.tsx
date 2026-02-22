"use client";

import { FormEvent, useState } from "react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";

type Props = {
  patientId: string;
  requestHeaders: Record<string, string>;
  onBooked: () => void;
};

export default function AppointmentBooking({ patientId, requestHeaders, onBooked }: Props) {
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
      headers: { "Content-Type": "application/json", ...requestHeaders },
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
    <Card>
      <form className="space-y-4" onSubmit={onSubmit}>
        <h2 className="text-xl font-semibold text-slate-900">Book Appointment</h2>
        <Field label="Provider name">
          <Input
            value={form.providerName}
            onChange={(e) => setForm({ ...form, providerName: e.target.value })}
            required
          />
        </Field>
        <Field label="Date and time">
          <Input
            type="datetime-local"
            value={form.appointmentDate}
            onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
            required
          />
        </Field>
        <Field label="Appointment type">
          <Select
            value={form.appointmentType}
            onChange={(e) =>
              setForm({ ...form, appointmentType: e.target.value as "telehealth" | "in_person" })
            }
          >
            <option value="telehealth">Telehealth</option>
            <option value="in_person">In-person</option>
          </Select>
        </Field>
        <Field label="Reason">
          <Textarea
            rows={3}
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            required
          />
        </Field>
        {message ? <Alert>{message}</Alert> : null}
        {error ? <Alert tone="error">{error}</Alert> : null}
        <Button type="submit" variant="primary">
          Create appointment
        </Button>
      </form>
    </Card>
  );
}
