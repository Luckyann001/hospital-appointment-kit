import { inferUrgency, TRIAGE_SAFETY_NOTICE } from "@/lib/health/safety";
import type { TriageResponse } from "@/lib/health/types";
import { getOpenAIClient } from "@/lib/openai/client";
import { getAuthContext, canAccessPatient } from "@/lib/security/auth";
import { writeAuditLog } from "@/lib/security/audit";
import { requestIdFrom, withRequestIdHeaders } from "@/lib/security/observability";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { withRetries } from "@/lib/security/retry";

function emergencyResponse(): TriageResponse {
  return {
    urgency: "emergency",
    reply:
      "Your message suggests potentially severe symptoms. This assistant cannot evaluate emergencies. Seek emergency care now.",
    safetyNotice: TRIAGE_SAFETY_NOTICE
  };
}

export async function POST(request: Request) {
  const requestId = requestIdFrom(request);
  const auth = await getAuthContext(request);

  if (!auth) {
    return withRequestIdHeaders({ error: "Unauthorized." }, requestId, 401);
  }

  const limit = checkRateLimit(`${auth.tenantId}:${auth.userId}:triage:post`, 12, 60_000);
  if (!limit.allowed) {
    return withRequestIdHeaders({ error: "Rate limit exceeded." }, requestId, 429);
  }

  const body = await request.json().catch(() => null);
  const patientId = typeof body?.patientId === "string" ? body.patientId : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!message || !patientId) {
    return withRequestIdHeaders({ error: "patientId and message are required." }, requestId, 400);
  }

  if (!canAccessPatient(auth, patientId)) {
    return withRequestIdHeaders({ error: "Forbidden." }, requestId, 403);
  }

  if (message.length > 2000) {
    return withRequestIdHeaders({ error: "message exceeds 2000 characters." }, requestId, 400);
  }

  const urgency = inferUrgency(message);
  if (urgency === "emergency") {
    await writeAuditLog({
      tenantId: auth.tenantId,
      actorId: auth.userId,
      actorRole: auth.role,
      action: "triage.request",
      resourceType: "triage",
      outcome: "success",
      metadata: { urgency: "emergency", bypassedModel: true }
    });

    return withRequestIdHeaders(emergencyResponse(), requestId, 200);
  }

  const client = getOpenAIClient();
  if (!client) {
    return withRequestIdHeaders(
      {
        urgency,
        reply:
          "OpenAI key is not configured. Based on your note, consider scheduling a clinical visit and monitor symptoms for worsening.",
        safetyNotice: TRIAGE_SAFETY_NOTICE
      },
      requestId,
      200
    );
  }

  try {
    const systemPrompt = [
      "You are a healthcare intake triage assistant.",
      "Do not provide diagnosis.",
      "Give concise pre-visit guidance and clear next-step suggestions.",
      "If symptoms appear severe, direct user to emergency care.",
      "Always include that this is not medical diagnosis."
    ].join(" ");

    const response = await withRetries(
      () =>
        client.responses.create({
          model: process.env.OPENAI_TRIAGE_MODEL ?? "gpt-4.1-mini",
          input: [
            {
              role: "system",
              content: [{ type: "input_text", text: systemPrompt }]
            },
            {
              role: "user",
              content: [{ type: "input_text", text: message }]
            }
          ],
          temperature: 0.2
        }),
      2,
      300
    );

    const reply = response.output_text?.trim() || "Please consult a licensed clinician for evaluation.";

    await writeAuditLog({
      tenantId: auth.tenantId,
      actorId: auth.userId,
      actorRole: auth.role,
      action: "triage.request",
      resourceType: "triage",
      outcome: "success",
      metadata: { urgency }
    });

    return withRequestIdHeaders(
      {
        urgency,
        reply,
        safetyNotice: TRIAGE_SAFETY_NOTICE
      } satisfies TriageResponse,
      requestId,
      200
    );
  } catch {
    await writeAuditLog({
      tenantId: auth.tenantId,
      actorId: auth.userId,
      actorRole: auth.role,
      action: "triage.request",
      resourceType: "triage",
      outcome: "failure"
    });

    return withRequestIdHeaders(
      {
        urgency,
        reply: "Unable to process triage request right now. Please contact your care team.",
        safetyNotice: TRIAGE_SAFETY_NOTICE
      } satisfies TriageResponse,
      requestId,
      200
    );
  }
}
