import { createHmac } from "node:crypto";
import { canAccessPatient, getAuthContext } from "../lib/security/auth";
import { __resetRateLimitStore, checkRateLimit } from "../lib/security/rate-limit";

function b64url(input: Buffer | string) {
  const value = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return value
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function makeToken(payload: Record<string, unknown>, secret: string) {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = b64url(JSON.stringify(header));
  const encodedPayload = b64url(JSON.stringify(payload));
  const signature = createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest();

  return `${encodedHeader}.${encodedPayload}.${b64url(signature)}`;
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

async function testJwtAuthContext() {
  process.env.AUTH_JWT_HS256_SECRET = "test-secret";
  process.env.AUTH_TENANT_CLAIM = "tenant_id";
  process.env.AUTH_USER_CLAIM = "sub";
  process.env.AUTH_ROLE_CLAIM = "role";
  process.env.ENABLE_DEMO_AUTH_FALLBACK = "false";
  process.env.ENABLE_HEADER_AUTH_FALLBACK = "false";

  const token = makeToken(
    {
      sub: "patient-001",
      tenant_id: "tenant-001",
      role: "patient",
      exp: Math.floor(Date.now() / 1000) + 300
    },
    "test-secret"
  );

  const request = new Request("http://localhost/api/test", {
    headers: {
      authorization: `Bearer ${token}`
    }
  });

  const auth = await getAuthContext(request);
  assert(Boolean(auth), "Auth context should be created from JWT");
  assert(auth?.tenantId === "tenant-001", "Tenant claim should be parsed");
  assert(auth?.userId === "patient-001", "User claim should be parsed");
  assert(auth?.role === "patient", "Role claim should be parsed");
}

function testRbacAndRateLimit() {
  const patientAuth = { tenantId: "tenant", userId: "patient-001", role: "patient" as const };
  assert(canAccessPatient(patientAuth, "patient-001") === true, "Patient should access own record");
  assert(canAccessPatient(patientAuth, "patient-999") === false, "Patient should not access others");

  __resetRateLimitStore();
  const key = "tenant:patient-001:triage";
  assert(checkRateLimit(key, 2, 60000).allowed === true, "First request should pass");
  assert(checkRateLimit(key, 2, 60000).allowed === true, "Second request should pass");
  assert(checkRateLimit(key, 2, 60000).allowed === false, "Third request should be limited");
}

async function main() {
  await testJwtAuthContext();
  testRbacAndRateLimit();
  console.log("Security tests passed.");
}

main().catch((error) => {
  console.error("Security tests failed:", error);
  process.exit(1);
});
