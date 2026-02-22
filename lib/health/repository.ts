import { createAppointment, createIntake, listAppointments, listIntakes } from "@/lib/health/store";
import type { Appointment, PatientIntake } from "@/lib/health/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type IntakeRow = {
  id: string;
  tenant_id: string;
  patient_id: string;
  full_name: string;
  date_of_birth: string;
  email: string;
  phone: string;
  preferred_language: string;
  chief_concern: string;
  symptom_duration_days: number;
  medications: string;
  allergies: string;
  conditions: string;
  consent: PatientIntake["consent"];
  created_at: string;
};

type AppointmentRow = {
  id: string;
  tenant_id: string;
  patient_id: string;
  provider_name: string;
  appointment_date: string;
  appointment_type: "in_person" | "telehealth";
  reason: string;
  status: "scheduled" | "completed" | "cancelled";
  created_at: string;
};

function mapIntakeRow(row: IntakeRow): PatientIntake {
  return {
    id: row.id,
    patientId: row.patient_id,
    fullName: row.full_name,
    dateOfBirth: row.date_of_birth,
    email: row.email,
    phone: row.phone,
    preferredLanguage: row.preferred_language,
    chiefConcern: row.chief_concern,
    symptomDurationDays: row.symptom_duration_days,
    medications: row.medications,
    allergies: row.allergies,
    conditions: row.conditions,
    consent: row.consent,
    createdAt: row.created_at
  };
}

function mapAppointmentRow(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    patientId: row.patient_id,
    providerName: row.provider_name,
    appointmentDate: row.appointment_date,
    appointmentType: row.appointment_type,
    reason: row.reason,
    status: row.status,
    createdAt: row.created_at
  };
}

export async function createIntakeRecord(
  tenantId: string,
  input: Omit<PatientIntake, "id" | "createdAt">
): Promise<PatientIntake> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return createIntake(input);

  const { data, error } = await supabase
    .from("patient_intakes")
    .insert({
      tenant_id: tenantId,
      patient_id: input.patientId,
      full_name: input.fullName,
      date_of_birth: input.dateOfBirth,
      email: input.email,
      phone: input.phone,
      preferred_language: input.preferredLanguage,
      chief_concern: input.chiefConcern,
      symptom_duration_days: input.symptomDurationDays,
      medications: input.medications,
      allergies: input.allergies,
      conditions: input.conditions,
      consent: input.consent
    })
    .select()
    .single<IntakeRow>();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create intake record.");
  }

  return mapIntakeRow(data);
}

export async function listIntakeRecords(tenantId: string, patientId?: string): Promise<PatientIntake[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return listIntakes(patientId);

  let query = supabase
    .from("patient_intakes")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (patientId) {
    query = query.eq("patient_id", patientId);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapIntakeRow(row as IntakeRow));
}

export async function createAppointmentRecord(
  tenantId: string,
  input: Omit<Appointment, "id" | "createdAt" | "status">
): Promise<Appointment> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return createAppointment(input);

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      tenant_id: tenantId,
      patient_id: input.patientId,
      provider_name: input.providerName,
      appointment_date: input.appointmentDate,
      appointment_type: input.appointmentType,
      reason: input.reason,
      status: "scheduled"
    })
    .select()
    .single<AppointmentRow>();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create appointment record.");
  }

  return mapAppointmentRow(data);
}

export async function listAppointmentRecords(
  tenantId: string,
  patientId?: string
): Promise<Appointment[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return listAppointments(patientId);

  let query = supabase
    .from("appointments")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (patientId) {
    query = query.eq("patient_id", patientId);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapAppointmentRow(row as AppointmentRow));
}
