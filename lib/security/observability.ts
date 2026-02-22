export function requestIdFrom(request: Request) {
  return request.headers.get("x-request-id")?.trim() || crypto.randomUUID();
}

export function logEvent(event: {
  requestId: string;
  route: string;
  action: string;
  tenantId?: string;
  userId?: string;
  status: "ok" | "error";
  details?: Record<string, unknown>;
}) {
  const payload = {
    ts: new Date().toISOString(),
    ...event
  };

  if (event.status === "error") {
    console.error("[health-api]", JSON.stringify(payload));
  } else {
    console.info("[health-api]", JSON.stringify(payload));
  }
}

export function withRequestIdHeaders(body: unknown, requestId: string, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "x-request-id": requestId
    }
  });
}
