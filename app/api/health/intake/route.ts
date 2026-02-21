import { NextResponse } from "next/server";
import { createIntake, listIntakes } from "@/lib/health/store";
import { validateIntakeInput } from "@/lib/health/validation";

const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const validated = validateIntakeInput(body);

  if (!validated.ok) {
    return json({ error: validated.errors.join(" ") }, 400);
  }

  const intake = createIntake(validated.data);
  return json({ intake }, 201);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get("patientId") ?? undefined;
  const intakes = listIntakes(patientId);
  return json({ intakes });
}
