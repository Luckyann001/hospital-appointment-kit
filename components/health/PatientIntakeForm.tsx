"use client";

import { FormEvent, useState } from "react";
import Alert from "@/components/ui/Alert";
import Card from "@/components/ui/Card";

const insuranceOptions = ["Aetna", "Blue Cross", "Cigna", "Kaiser", "UnitedHealthcare", "Other"];

type Props = {
  patientId: string;
  requestHeaders: Record<string, string>;
  onSubmitted: () => void;
};

export default function PatientIntakeForm({ patientId, requestHeaders, onSubmitted }: Props) {
  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    insuranceProvider: "",
    reasonForVisit: ""
  });
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const emailFromName = `${form.fullName.toLowerCase().trim().replace(/\s+/g, ".") || "patient"}@demo.local`;

    const res = await fetch("/api/health/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...requestHeaders },
      body: JSON.stringify({
        patientId,
        fullName: form.fullName,
        dateOfBirth: form.dateOfBirth,
        email: emailFromName,
        phone: "(555) 010-1000",
        preferredLanguage: "English",
        chiefConcern: `${form.reasonForVisit} | Insurance: ${form.insuranceProvider}`,
        symptomDurationDays: 0,
        medications: "",
        allergies: "",
        conditions: "",
        consent: {
          treatmentConsent: true,
          privacyNoticeAccepted: true,
          telehealthConsent: true
        }
      })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to submit intake.");
      return;
    }

    setMessage("Intake submitted.");
    onSubmitted();
  }

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white p-6">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-4xl font-semibold text-slate-900">Patient Intake</h2>

        <div>
          <label className="label-base">Full name</label>
          <input
            className="input-base"
            placeholder="Enter patient name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="label-base">Date of birth</label>
          <input
            className="input-base"
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="label-base">Insurance provider</label>
          <select
            className="input-base"
            value={form.insuranceProvider}
            onChange={(e) => setForm({ ...form, insuranceProvider: e.target.value })}
            required
          >
            <option value="" disabled>
              Select insurance
            </option>
            {insuranceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-base">Reason for visit</label>
          <textarea
            className="textarea-base"
            rows={2}
            placeholder="Brief description"
            value={form.reasonForVisit}
            onChange={(e) => setForm({ ...form, reasonForVisit: e.target.value })}
            required
          />
        </div>

        {message ? <Alert>{message}</Alert> : null}
        {error ? <Alert tone="error">{error}</Alert> : null}

        <button
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-accent px-5 text-xl font-semibold text-white transition hover:bg-[#0b8f87] disabled:opacity-70"
          disabled={loading}
          type="submit"
        >
          {loading ? "Submitting..." : "Submit Intake"}
        </button>
      </form>
    </Card>
  );
}
