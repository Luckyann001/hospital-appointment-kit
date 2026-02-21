"use client";

import { FormEvent, useState } from "react";

type Props = {
  patientId: string;
  onSubmitted: () => void;
};

export default function PatientIntakeForm({ patientId, onSubmitted }: Props) {
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
      headers: { "Content-Type": "application/json" },
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
    <form className="panel grid" onSubmit={handleSubmit}>
      <h2>Patient Intake</h2>
      <div className="grid grid-2">
        <label>
          Full name
          <input
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
        </label>
        <label>
          Date of birth
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label>
          Phone
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
        </label>
        <label>
          Preferred language
          <input
            value={form.preferredLanguage}
            onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value })}
            required
          />
        </label>
        <label>
          Symptom duration (days)
          <input
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
        </label>
      </div>
      <label>
        Chief concern
        <textarea
          rows={3}
          value={form.chiefConcern}
          onChange={(e) => setForm({ ...form, chiefConcern: e.target.value })}
          required
        />
      </label>
      <label>
        Current medications
        <textarea
          rows={2}
          value={form.medications}
          onChange={(e) => setForm({ ...form, medications: e.target.value })}
        />
      </label>
      <label>
        Allergies
        <textarea
          rows={2}
          value={form.allergies}
          onChange={(e) => setForm({ ...form, allergies: e.target.value })}
        />
      </label>
      <label>
        Medical conditions
        <textarea
          rows={2}
          value={form.conditions}
          onChange={(e) => setForm({ ...form, conditions: e.target.value })}
        />
      </label>

      <div className="grid">
        <label>
          <input
            type="checkbox"
            checked={form.consent.treatmentConsent}
            onChange={(e) =>
              setForm({
                ...form,
                consent: { ...form.consent, treatmentConsent: e.target.checked }
              })
            }
          />{" "}
          I consent to treatment planning.
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.consent.privacyNoticeAccepted}
            onChange={(e) =>
              setForm({
                ...form,
                consent: { ...form.consent, privacyNoticeAccepted: e.target.checked }
              })
            }
          />{" "}
          I acknowledge the privacy notice.
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.consent.telehealthConsent}
            onChange={(e) =>
              setForm({
                ...form,
                consent: { ...form.consent, telehealthConsent: e.target.checked }
              })
            }
          />{" "}
          I consent to telehealth communication when applicable.
        </label>
      </div>

      {message ? <div className="notice">{message}</div> : null}
      {error ? <div className="notice error">{error}</div> : null}
      <button disabled={loading}>{loading ? "Submitting..." : "Submit intake"}</button>
    </form>
  );
}
