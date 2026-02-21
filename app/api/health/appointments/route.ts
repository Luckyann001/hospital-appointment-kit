import { NextResponse } from "next/server";
import { createAppointment, listAppointments } from "@/lib/health/store";
import { validateAppointmentInput } from "@/lib/health/validation";

const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const validated = validateAppointmentInput(body);

  if (!validated.ok) {
    return json({ error: validated.errors.join(" ") }, 400);
  }

  const appointment = createAppointment(validated.data);
  return json({ appointment }, 201);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") ?? "patient";
  const patientId = searchParams.get("patientId") ?? undefined;

  const appointments = role === "provider" ? listAppointments() : listAppointments(patientId);

  return json({ appointments });
}
