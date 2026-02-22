import { verifyJwtFromRequest } from "./jwt";

export type AppRole = "patient" | "provider" | "admin";

export type AuthContext = {
  tenantId: string;
  userId: string;
  role: AppRole;
};

const ALLOWED_ROLES = new Set<AppRole>(["patient", "provider", "admin"]);

function pickString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function roleFromValue(value: unknown): AppRole | null {
  const maybe = pickString(value);
  if (ALLOWED_ROLES.has(maybe as AppRole)) return maybe as AppRole;
  return null;
}

function extractAuthFromHeaders(request: Request): AuthContext | null {
  const tenantId = request.headers.get("x-tenant-id")?.trim() ?? "";
  const userId = request.headers.get("x-user-id")?.trim() ?? "";
  const roleHeader = request.headers.get("x-user-role")?.trim() ?? "";

  const role = roleFromValue(roleHeader);
  if (!tenantId || !userId || !role) return null;

  return { tenantId, userId, role };
}

function extractAuthFromClaims(claims: Record<string, unknown>): AuthContext | null {
  const tenantClaim = process.env.AUTH_TENANT_CLAIM ?? "tenant_id";
  const roleClaim = process.env.AUTH_ROLE_CLAIM ?? "role";
  const userClaim = process.env.AUTH_USER_CLAIM ?? "sub";

  const tenantId = pickString(claims[tenantClaim]);
  const userId = pickString(claims[userClaim]);
  const role = roleFromValue(claims[roleClaim]);

  if (!tenantId || !userId || !role) return null;

  return { tenantId, userId, role };
}

export async function getAuthContext(request: Request): Promise<AuthContext | null> {
  try {
    const jwtClaims = await verifyJwtFromRequest(request);
    if (jwtClaims) {
      const fromJwt = extractAuthFromClaims(jwtClaims as Record<string, unknown>);
      if (fromJwt) return fromJwt;
    }
  } catch {
    // Continue to optional fallback paths below.
  }

  const allowHeaderFallback = process.env.ENABLE_HEADER_AUTH_FALLBACK === "true";
  if (allowHeaderFallback) {
    const fromHeaders = extractAuthFromHeaders(request);
    if (fromHeaders) return fromHeaders;
  }

  if (process.env.NODE_ENV !== "production" && process.env.ENABLE_DEMO_AUTH_FALLBACK === "true") {
    const role = roleFromValue(process.env.DEMO_USER_ROLE) ?? "patient";
    return {
      tenantId: process.env.DEMO_TENANT_ID ?? "tenant-demo-001",
      userId: process.env.DEMO_USER_ID ?? "patient-demo-001",
      role
    };
  }

  return null;
}

export function canAccessPatient(auth: AuthContext, patientId: string) {
  if (auth.role === "admin" || auth.role === "provider") return true;
  return auth.userId === patientId;
}
