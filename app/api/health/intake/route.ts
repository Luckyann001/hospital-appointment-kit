import { createIntakeRecord, listIntakeRecords } from "@/lib/health/repository";
import { validateIntakeInput } from "@/lib/health/validation";
import { getAuthContext, canAccessPatient } from "@/lib/security/auth";
import { writeAuditLog } from "@/lib/security/audit";
import { requestIdFrom, logEvent, withRequestIdHeaders } from "@/lib/security/observability";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const requestId = requestIdFrom(request);
  const auth = await getAuthContext(request);

  if (!auth) {
    return withRequestIdHeaders({ error: "Unauthorized." }, requestId, 401);
  }

  const limit = checkRateLimit(`${auth.tenantId}:${auth.userId}:intake:post`, 20, 60_000);
  if (!limit.allowed) {
    return withRequestIdHeaders({ error: "Rate limit exceeded." }, requestId, 429);
  }

  const body = await request.json().catch(() => null);
  const validated = validateIntakeInput(body);

  if (!validated.ok) {
    await writeAuditLog({
      tenantId: auth.tenantId,
      actorId: auth.userId,
      actorRole: auth.role,
      action: "intake.create",
      resourceType: "patient_intake",
      outcome: "failure",
      metadata: { reason: "validation_error" }
    });
    return withRequestIdHeaders({ error: validated.errors.join(" ") }, requestId, 400);
  }

  if (!canAccessPatient(auth, validated.data.patientId)) {
    return withRequestIdHeaders({ error: "Forbidden." }, requestId, 403);
  }

  try {
    const intake = await createIntakeRecord(auth.tenantId, validated.data);

    await writeAuditLog({
      tenantId: auth.tenantId,
      actorId: auth.userId,
      actorRole: auth.role,
      action: "intake.create",
      resourceType: "patient_intake",
      resourceId: intake.id,
      outcome: "success"
    });

    logEvent({
      requestId,
      route: "/api/health/intake",
      action: "POST",
      tenantId: auth.tenantId,
      userId: auth.userId,
      status: "ok"
    });

    return withRequestIdHeaders({ intake }, requestId, 201);
  } catch (error) {
    logEvent({
      requestId,
      route: "/api/health/intake",
      action: "POST",
      tenantId: auth.tenantId,
      userId: auth.userId,
      status: "error",
      details: { message: error instanceof Error ? error.message : "unknown" }
    });

    return withRequestIdHeaders(
      {
        error: error instanceof Error ? error.message : "Unable to create intake record."
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
  const patientId = searchParams.get("patientId") ?? undefined;

  if (patientId && !canAccessPatient(auth, patientId)) {
    return withRequestIdHeaders({ error: "Forbidden." }, requestId, 403);
  }

  const scopedPatientId = auth.role === "patient" ? auth.userId : patientId;

  try {
    const intakes = await listIntakeRecords(auth.tenantId, scopedPatientId);
    return withRequestIdHeaders({ intakes }, requestId, 200);
  } catch (error) {
    return withRequestIdHeaders(
      {
        error: error instanceof Error ? error.message : "Unable to load intake records."
      },
      requestId,
      500
    );
  }
}
