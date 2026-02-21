export type UserRole = "patient" | "provider";

export type ConsentFlags = {
  treatmentConsent: boolean;
  privacyNoticeAccepted: boolean;
  telehealthConsent: boolean;
};

export type TriageUrgency = "routine" | "soon" | "urgent" | "emergency";

export type PatientIntake = {
  id: string;
  patientId: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  preferredLanguage: string;
  chiefConcern: string;
  symptomDurationDays: number;
  medications: string;
  allergies: string;
  conditions: string;
  consent: ConsentFlags;
  createdAt: string;
};

export type Appointment = {
  id: string;
  patientId: string;
  providerName: string;
  appointmentDate: string;
  appointmentType: "in_person" | "telehealth";
  reason: string;
  status: "scheduled" | "completed" | "cancelled";
  createdAt: string;
};

export type TriageRequest = {
  patientId: string;
  message: string;
};

export type TriageResponse = {
  reply: string;
  urgency: TriageUrgency;
  safetyNotice: string;
};
