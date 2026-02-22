"use client";

import { FormEvent, useState } from "react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

type Props = {
  patientId: string;
  requestHeaders: Record<string, string>;
  onSubmitted: () => void;
};

export default function PatientIntakeForm({ patientId, requestHeaders, onSubmitted }: Props) {
  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    preferredLanguage: "English",
    chiefConcern: "",
    symptomDurationDays: 0,
    medications: "",
    allergies: "",
    conditions: "",
    consent: {
      treatmentConsent: false,
      privacyNoticeAccepted: false,
      telehealthConsent: false
    }
  });
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const res = await fetch("/api/health/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...requestHeaders },
      body: JSON.stringify({ patientId, ...form })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to submit intake.");
      return;
    }

    setMessage("Intake form submitted.");
    onSubmitted();
  }

  return (
    <Card>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold text-slate-900">Patient Intake</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full name">
            <Input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </Field>
          <Field label="Date of birth">
            <Input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              required
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </Field>
          <Field label="Phone">
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </Field>
          <Field label="Preferred language">
            <Input
              value={form.preferredLanguage}
              onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value })}
              required
            />
          </Field>
          <Field label="Symptom duration (days)">
            <Input
              type="number"
              min={0}
              value={form.symptomDurationDays}
              onChange={(e) =>
                setForm({
                  ...form,
                  symptomDurationDays: Number.parseInt(e.target.value || "0", 10)
                })
              }
              required
            />
          </Field>
        </div>

        <Field label="Chief concern">
          <Textarea
            rows={3}
            value={form.chiefConcern}
            onChange={(e) => setForm({ ...form, chiefConcern: e.target.value })}
            required
          />
        </Field>
        <Field label="Current medications">
          <Textarea
            rows={2}
            value={form.medications}
            onChange={(e) => setForm({ ...form, medications: e.target.value })}
          />
        </Field>
        <Field label="Allergies">
          <Textarea
            rows={2}
            value={form.allergies}
            onChange={(e) => setForm({ ...form, allergies: e.target.value })}
          />
        </Field>
        <Field label="Medical conditions">
          <Textarea
            rows={2}
            value={form.conditions}
            onChange={(e) => setForm({ ...form, conditions: e.target.value })}
          />
        </Field>

        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <CheckboxRow
            checked={form.consent.treatmentConsent}
            onChange={(checked) =>
              setForm({
                ...form,
                consent: { ...form.consent, treatmentConsent: checked }
              })
            }
            label="I consent to treatment planning."
          />
          <CheckboxRow
            checked={form.consent.privacyNoticeAccepted}
            onChange={(checked) =>
              setForm({
                ...form,
                consent: { ...form.consent, privacyNoticeAccepted: checked }
              })
            }
            label="I acknowledge the privacy notice."
          />
          <CheckboxRow
            checked={form.consent.telehealthConsent}
            onChange={(checked) =>
              setForm({
                ...form,
                consent: { ...form.consent, telehealthConsent: checked }
              })
            }
            label="I consent to telehealth communication when applicable."
          />
        </div>

        {message ? <Alert>{message}</Alert> : null}
        {error ? <Alert tone="error">{error}</Alert> : null}

        <Button disabled={loading}>{loading ? "Submitting..." : "Submit intake"}</Button>
      </form>
    </Card>
  );
}

function CheckboxRow({
  checked,
  onChange,
  label
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300"
      />
      <span>{label}</span>
    </label>
  );
}
