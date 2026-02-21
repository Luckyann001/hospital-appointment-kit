import { NextResponse } from "next/server";
import { inferUrgency, TRIAGE_SAFETY_NOTICE } from "@/lib/health/safety";
import type { TriageResponse } from "@/lib/health/types";

const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

function emergencyResponse(): TriageResponse {
  return {
    urgency: "emergency",
    reply:
      "Your message suggests potentially severe symptoms. This assistant cannot evaluate emergencies. Seek emergency care now.",
    safetyNotice: TRIAGE_SAFETY_NOTICE
  };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!message) {
    return json({ error: "message is required." }, 400);
  }

  if (message.length > 2000) {
    return json({ error: "message exceeds 2000 characters." }, 400);
  }

  const urgency = inferUrgency(message);
  if (urgency === "emergency") {
    return json(emergencyResponse());
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return json({
      urgency,
      reply:
        "OpenAI key is not configured. Based on your note, consider scheduling a clinical visit and monitor symptoms for worsening.",
      safetyNotice: TRIAGE_SAFETY_NOTICE
    });
  }

  try {
    const systemPrompt = [
      "You are a healthcare intake triage assistant.",
      "Do not provide diagnosis.",
      "Give concise pre-visit guidance and clear next-step suggestions.",
      "If symptoms appear severe, direct user to emergency care.",
      "Always include that this is not medical diagnosis."
    ].join(" ");

    const aiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
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
      })
    });

    if (!aiRes.ok) {
      const fallback: TriageResponse = {
        urgency,
        reply:
          "Triage assistant is temporarily unavailable. Please use standard appointment booking to speak with a clinician.",
        safetyNotice: TRIAGE_SAFETY_NOTICE
      };
      return json(fallback);
    }

    const payload = (await aiRes.json()) as { output_text?: string };
    const reply = payload.output_text?.trim() || "Please consult a licensed clinician for evaluation.";

    return json({
      urgency,
      reply,
      safetyNotice: TRIAGE_SAFETY_NOTICE
    } satisfies TriageResponse);
  } catch {
    return json({
      urgency,
      reply: "Unable to process triage request right now. Please contact your care team.",
      safetyNotice: TRIAGE_SAFETY_NOTICE
    } satisfies TriageResponse);
  }
}
