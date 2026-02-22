import { createHmac } from "node:crypto";

type JwtPayload = Record<string, unknown>;

function base64UrlDecode(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
}

function parseJwt(token: string): { header: Record<string, unknown>; payload: JwtPayload; signature: string } | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const header = JSON.parse(base64UrlDecode(parts[0])) as Record<string, unknown>;
    const payload = JSON.parse(base64UrlDecode(parts[1])) as JwtPayload;
    return { header, payload, signature: parts[2] };
  } catch {
    return null;
  }
}

function base64UrlEncodeBuffer(value: Buffer) {
  return value
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function getBearerToken(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  if (!auth.toLowerCase().startsWith("bearer ")) return null;
  const token = auth.slice(7).trim();
  return token || null;
}

function validateStandardClaims(payload: JwtPayload) {
  const now = Math.floor(Date.now() / 1000);
  const exp = typeof payload.exp === "number" ? payload.exp : null;
  const nbf = typeof payload.nbf === "number" ? payload.nbf : null;

  if (exp && now > exp) return false;
  if (nbf && now < nbf) return false;

  const issuer = process.env.AUTH_JWT_ISSUER;
  const audience = process.env.AUTH_JWT_AUDIENCE;

  if (issuer && payload.iss !== issuer) return false;

  if (audience) {
    const aud = payload.aud;
    if (typeof aud === "string" && aud !== audience) return false;
    if (Array.isArray(aud) && !aud.includes(audience)) return false;
  }

  return true;
}

async function verifyViaSupabaseUserinfo(token: string): Promise<JwtPayload | null> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) return null;

  const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) return null;

  const data = (await res.json()) as {
    id?: string;
    role?: string;
    app_metadata?: Record<string, unknown>;
    user_metadata?: Record<string, unknown>;
  };

  const payload: JwtPayload = {
    sub: data.id,
    role: data.app_metadata?.role ?? data.role,
    tenant_id: data.app_metadata?.tenant_id ?? data.user_metadata?.tenant_id
  };

  return payload;
}

export async function verifyJwtFromRequest(request: Request): Promise<JwtPayload | null> {
  const token = getBearerToken(request);
  if (!token) return null;

  const hsSecret = process.env.AUTH_JWT_HS256_SECRET;
  if (hsSecret) {
    const parsed = parseJwt(token);
    if (!parsed) return null;

    if (parsed.header.alg !== "HS256") return null;

    const [headerB64, payloadB64] = token.split(".");
    const expectedSig = createHmac("sha256", hsSecret).update(`${headerB64}.${payloadB64}`).digest();
    const expectedB64 = base64UrlEncodeBuffer(expectedSig);

    if (expectedB64 !== parsed.signature) return null;
    if (!validateStandardClaims(parsed.payload)) return null;

    return parsed.payload;
  }

  const supabasePayload = await verifyViaSupabaseUserinfo(token);
  if (supabasePayload && validateStandardClaims(supabasePayload)) {
    return supabasePayload;
  }

  return null;
}
