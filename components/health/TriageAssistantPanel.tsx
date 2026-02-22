"use client";

import { FormEvent, useState } from "react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Field from "@/components/ui/Field";
import Textarea from "@/components/ui/Textarea";

type Props = {
  patientId: string;
  requestHeaders: Record<string, string>;
};

type TriageResult = {
  reply: string;
  urgency: "routine" | "soon" | "urgent" | "emergency";
  safetyNotice: string;
};

export default function TriageAssistantPanel({ patientId, requestHeaders }: Props) {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<TriageResult | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

    const res = await fetch("/api/ai/triage-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...requestHeaders },
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
    <Card>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">AI Pre-Visit Triage</h2>
        <Alert>This assistant is non-diagnostic and does not replace clinical evaluation.</Alert>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Field label="Describe your current symptoms">
            <Textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </Field>
          <Button type="submit">Run triage</Button>
        </form>
        {error ? <Alert tone="error">{error}</Alert> : null}
        {result ? (
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-muted">Suggested urgency</p>
              <p className="mt-1 text-sm font-semibold uppercase text-primary">{result.urgency}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-700">
              {result.reply}
            </div>
            <Alert tone="error">{result.safetyNotice}</Alert>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
