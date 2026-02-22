import { createAppointmentRecord, listAppointmentRecords } from "@/lib/health/repository";
import { validateAppointmentInput } from "@/lib/health/validation";
import { getAuthContext, canAccessPatient } from "@/lib/security/auth";
import { writeAuditLog } from "@/lib/security/audit";
import { requestIdFrom, withRequestIdHeaders } from "@/lib/security/observability";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const requestId = requestIdFrom(request);
  const auth = await getAuthContext(request);

  if (!auth) {
    return withRequestIdHeaders({ error: "Unauthorized." }, requestId, 401);
  }

  const limit = checkRateLimit(`${auth.tenantId}:${auth.userId}:appointments:post`, 30, 60_000);
  if (!limit.allowed) {
    return withRequestIdHeaders({ error: "Rate limit exceeded." }, requestId, 429);
  }

  const body = await request.json().catch(() => null);
  const validated = validateAppointmentInput(body);

  if (!validated.ok) {
    return withRequestIdHeaders({ error: validated.errors.join(" ") }, requestId, 400);
  }

  if (!canAccessPatient(auth, validated.data.patientId)) {
    return withRequestIdHeaders({ error: "Forbidden." }, requestId, 403);
  }

  try {
    const appointment = await createAppointmentRecord(auth.tenantId, validated.data);

    await writeAuditLog({
      tenantId: auth.tenantId,
      actorId: auth.userId,
      actorRole: auth.role,
      action: "appointment.create",
      resourceType: "appointment",
      resourceId: appointment.id,
      outcome: "success"
    });

    return withRequestIdHeaders({ appointment }, requestId, 201);
  } catch (error) {
    return withRequestIdHeaders(
      {
        error: error instanceof Error ? error.message : "Unable to create appointment."
      },
      requestId,
      500
    );
  }
}

export async function GET(request: Request) {
  const requestId = requestIdFrom(request);
  const auth = await getAuthContext(request);

  if (!auth) {
    return withRequestIdHeaders({ error: "Unauthorized." }, requestId, 401);
  }

  const { searchParams } = new URL(request.url);
  const requestedRole = searchParams.get("role") ?? "patient";
  const patientId = searchParams.get("patientId") ?? undefined;

  const isProviderView = requestedRole === "provider" && (auth.role === "provider" || auth.role === "admin");

  if (patientId && !canAccessPatient(auth, patientId)) {
    return withRequestIdHeaders({ error: "Forbidden." }, requestId, 403);
  }

  const scopedPatientId = isProviderView ? patientId : auth.role === "patient" ? auth.userId : patientId;

  try {
    const appointments = await listAppointmentRecords(auth.tenantId, scopedPatientId);
    return withRequestIdHeaders({ appointments }, requestId, 200);
  } catch (error) {
    return withRequestIdHeaders(
      {
        error: error instanceof Error ? error.message : "Unable to load appointments."
      },
      requestId,
      500
    );
  }
}
