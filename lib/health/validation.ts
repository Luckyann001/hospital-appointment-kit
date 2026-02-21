import { Appointment, PatientIntake } from "./types";

type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: string[] };

const isNonEmpty = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isISODate = (value: string): boolean =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value).getTime());

export function validateIntakeInput(input: unknown): ValidationResult<Omit<PatientIntake, "id" | "createdAt">> {
  const errors: string[] = [];
  if (!input || typeof input !== "object") {
    return { ok: false, errors: ["Invalid request body."] };
  }

  const body = input as Record<string, unknown>;
  const consent = (body.consent as Record<string, unknown>) || {};

  if (!isNonEmpty(body.patientId)) errors.push("patientId is required.");
  if (!isNonEmpty(body.fullName)) errors.push("fullName is required.");
  if (!isNonEmpty(body.dateOfBirth) || !isISODate(body.dateOfBirth)) {
    errors.push("dateOfBirth must be a valid YYYY-MM-DD date.");
  }
  if (!isNonEmpty(body.email) || !isEmail(body.email)) errors.push("Valid email is required.");
  if (!isNonEmpty(body.phone)) errors.push("phone is required.");
  if (!isNonEmpty(body.preferredLanguage)) errors.push("preferredLanguage is required.");
  if (!isNonEmpty(body.chiefConcern)) errors.push("chiefConcern is required.");

  const symptomDurationDays = Number(body.symptomDurationDays);
  if (!Number.isFinite(symptomDurationDays) || symptomDurationDays < 0 || symptomDurationDays > 3650) {
    errors.push("symptomDurationDays must be between 0 and 3650.");
  }

  if (consent.treatmentConsent !== true) errors.push("treatmentConsent must be accepted.");
  if (consent.privacyNoticeAccepted !== true) errors.push("privacyNoticeAccepted must be accepted.");
  if (consent.telehealthConsent !== true) errors.push("telehealthConsent must be accepted.");

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      patientId: String(body.patientId).trim(),
      fullName: String(body.fullName).trim(),
      dateOfBirth: String(body.dateOfBirth),
      email: String(body.email).trim().toLowerCase(),
      phone: String(body.phone).trim(),
      preferredLanguage: String(body.preferredLanguage).trim(),
      chiefConcern: String(body.chiefConcern).trim(),
      symptomDurationDays,
      medications: String(body.medications ?? "").trim(),
      allergies: String(body.allergies ?? "").trim(),
      conditions: String(body.conditions ?? "").trim(),
      consent: {
        treatmentConsent: true,
        privacyNoticeAccepted: true,
        telehealthConsent: true
      }
    }
  };
}

export function validateAppointmentInput(
  input: unknown
): ValidationResult<Omit<Appointment, "id" | "createdAt" | "status">> {
  const errors: string[] = [];
  if (!input || typeof input !== "object") {
    return { ok: false, errors: ["Invalid request body."] };
  }

  const body = input as Record<string, unknown>;

  if (!isNonEmpty(body.patientId)) errors.push("patientId is required.");
  if (!isNonEmpty(body.providerName)) errors.push("providerName is required.");
  if (!isNonEmpty(body.appointmentDate) || Number.isNaN(Date.parse(String(body.appointmentDate)))) {
    errors.push("appointmentDate must be a valid ISO date-time.");
  }

  const appointmentType = body.appointmentType;
  if (appointmentType !== "in_person" && appointmentType !== "telehealth") {
    errors.push("appointmentType must be in_person or telehealth.");
  }

  if (!isNonEmpty(body.reason)) errors.push("reason is required.");

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      patientId: String(body.patientId).trim(),
      providerName: String(body.providerName).trim(),
      appointmentDate: new Date(String(body.appointmentDate)).toISOString(),
      appointmentType: body.appointmentType as "in_person" | "telehealth",
      reason: String(body.reason).trim()
    }
  };
}
