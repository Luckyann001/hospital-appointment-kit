import { getSupabaseServerClient } from "@/lib/supabase/server";

type AuditEntry = {
  tenantId: string;
  actorId: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  outcome: "success" | "failure";
  metadata?: Record<string, unknown>;
};

export async function writeAuditLog(entry: AuditEntry) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    console.info("[audit-log]", JSON.stringify({ ts: new Date().toISOString(), ...entry }));
    return;
  }

  await supabase.from("audit_logs").insert({
    tenant_id: entry.tenantId,
    actor_id: entry.actorId,
    actor_role: entry.actorRole,
    action: entry.action,
    resource_type: entry.resourceType,
    resource_id: entry.resourceId ?? null,
    outcome: entry.outcome,
    metadata: entry.metadata ?? {}
  });
}
