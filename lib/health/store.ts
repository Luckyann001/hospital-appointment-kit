import { Appointment, PatientIntake } from "./types";

const intakeStore: PatientIntake[] = [];
const appointmentStore: Appointment[] = [];

const makeId = (prefix: string): string => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

export function createIntake(input: Omit<PatientIntake, "id" | "createdAt">): PatientIntake {
  const intake: PatientIntake = {
    ...input,
    id: makeId("intake"),
    createdAt: new Date().toISOString()
  };
  intakeStore.unshift(intake);
  return intake;
}

export function createAppointment(
  input: Omit<Appointment, "id" | "createdAt" | "status">
): Appointment {
  const appointment: Appointment = {
    ...input,
    id: makeId("appt"),
    status: "scheduled",
    createdAt: new Date().toISOString()
  };
  appointmentStore.unshift(appointment);
  return appointment;
}

export function listAppointments(patientId?: string): Appointment[] {
  if (!patientId) return [...appointmentStore];
  return appointmentStore.filter((a) => a.patientId === patientId);
}

export function listIntakes(patientId?: string): PatientIntake[] {
  if (!patientId) return [...intakeStore];
  return intakeStore.filter((i) => i.patientId === patientId);
}
