import { TriageUrgency } from "./types";

export const TRIAGE_SAFETY_NOTICE =
  "AI triage is informational only and not a diagnosis. If you have severe symptoms (chest pain, trouble breathing, stroke signs, heavy bleeding, or thoughts of self-harm), call 911 or go to the nearest emergency department immediately.";

const emergencySignals = [
  "chest pain",
  "trouble breathing",
  "shortness of breath",
  "stroke",
  "fainting",
  "seizure",
  "severe bleeding",
  "suicidal",
  "self-harm"
];

export function inferUrgency(message: string): TriageUrgency {
  const normalized = message.toLowerCase();
  if (emergencySignals.some((signal) => normalized.includes(signal))) return "emergency";
  if (normalized.includes("worse") || normalized.includes("high fever")) return "urgent";
  if (normalized.includes("pain") || normalized.includes("vomit")) return "soon";
  return "routine";
}
