"use client";

import { FormEvent, useState } from "react";

type Props = {
  patientId: string;
};

type TriageResult = {
  reply: string;
  urgency: "routine" | "soon" | "urgent" | "emergency";
  safetyNotice: string;
};

export default function TriageAssistantPanel({ patientId }: Props) {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<TriageResult | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

    const res = await fetch("/api/ai/triage-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, message })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Unable to run triage assistant.");
      return;
    }

    setResult(data);
  }

  return (
    <section className="panel grid">
      <h2>AI Pre-Visit Triage</h2>
      <div className="notice">
        This assistant is non-diagnostic and does not replace clinical evaluation.
      </div>
      <form className="grid" onSubmit={handleSubmit}>
        <label>
          Describe your current symptoms
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>
        <button type="submit">Run triage</button>
      </form>
      {error ? <div className="notice error">{error}</div> : null}
      {result ? (
        <div className="grid">
          <div>
            <strong>Suggested urgency:</strong> {result.urgency}
          </div>
          <div>{result.reply}</div>
          <div className="notice error">{result.safetyNotice}</div>
        </div>
      ) : null}
    </section>
  );
}
