import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getAuthContext } from "@/lib/security/auth";
import { writeAuditLog } from "@/lib/security/audit";
import { checkRateLimit } from "@/lib/security/rate-limit";

const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
const ALLOWED_SECTION_KEYS = new Set([
  "hero",
  "trust",
  "problem_solution",
  "feature",
  "security",
  "case_study",
  "final_cta"
]);

export async function POST(request: Request) {
  const auth = await getAuthContext(request);
  if (!auth || (auth.role !== "provider" && auth.role !== "admin")) {
    return json({ error: "Forbidden." }, 403);
  }

  const limit = checkRateLimit(`${auth.tenantId}:${auth.userId}:media:upload`, 20, 60_000);
  if (!limit.allowed) {
    return json({ error: "Rate limit exceeded." }, 429);
  }

  if (!isSupabaseConfigured()) {
    return json({ error: "Supabase is not configured." }, 500);
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return json({ error: "Invalid multipart form data." }, 400);
  }

  const file = formData.get("file");
  const section = String(formData.get("section") ?? "hero");

  if (!(file instanceof File)) {
    return json({ error: "file is required." }, 400);
  }

  if (!ALLOWED_SECTION_KEYS.has(section)) {
    return json(
      {
        error:
          "Invalid section. Use one of: hero, trust, problem_solution, feature, security, case_study, final_cta."
      },
      400
    );
  }

  if (!ALLOWED_MIME.has(file.type)) {
    return json({ error: "Unsupported file type." }, 400);
  }

  if (file.size > MAX_FILE_BYTES) {
    return json({ error: "File exceeds 10MB limit." }, 400);
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() : "bin";
  const safeExt = ext && ext.length <= 8 ? ext : "bin";
  const path = `landing/${section}/${Date.now()}-${crypto.randomUUID()}.${safeExt}`;

  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "genix-assets";
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return json({ error: "Supabase is not configured." }, 500);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadRes = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType: file.type,
    upsert: true,
    cacheControl: "3600"
  });

  if (uploadRes.error) {
    await writeAuditLog({
      tenantId: auth.tenantId,
      actorId: auth.userId,
      actorRole: auth.role,
      action: "media.upload",
      resourceType: "asset",
      outcome: "failure",
      metadata: { section, bucket, reason: uploadRes.error.message }
    });
    return json({ error: uploadRes.error.message }, 500);
  }

  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);

  await writeAuditLog({
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.role,
    action: "media.upload",
    resourceType: "asset",
    resourceId: path,
    outcome: "success",
    metadata: { section, bucket }
  });

  return json({
    bucket,
    path,
    section,
    publicUrl: publicData.publicUrl,
    genixAssetMappingKey: section === "hero" ? "assets.hero_image_url" : `assets.section_images.${section}`
  });
}
