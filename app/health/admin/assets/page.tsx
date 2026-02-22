"use client";

import { useMemo, useState } from "react";
import GenixAssetAdmin from "@/components/health/GenixAssetAdmin";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function HealthAssetsAdminPage() {
  const [tenantId, setTenantId] = useState("tenant-demo-001");
  const [actorUserId, setActorUserId] = useState("provider-demo-001");
  const [role, setRole] = useState<"provider" | "admin">("provider");

  const authHeaders = useMemo(
    () => ({
      "x-tenant-id": tenantId,
      "x-user-id": actorUserId,
      "x-user-role": role
    }),
    [actorUserId, role, tenantId]
  );

  return (
    <AppShell
      title="Genix Asset Administration"
      subtitle="Upload and map landing assets without cluttering the clinical operations screen."
      role="provider"
      activeHref="/health/admin/assets"
    >
      <div className="grid gap-6">
        <Card className="grid gap-4 md:grid-cols-3">
          <Field label="Tenant ID">
            <Input value={tenantId} onChange={(e) => setTenantId(e.target.value)} />
          </Field>
          <Field label="Actor user ID">
            <Input value={actorUserId} onChange={(e) => setActorUserId(e.target.value)} />
          </Field>
          <Field label="Role">
            <Select value={role} onChange={(e) => setRole(e.target.value as "provider" | "admin")}>
              <option value="provider">Provider</option>
              <option value="admin">Admin</option>
            </Select>
          </Field>
        </Card>

        <GenixAssetAdmin requestHeaders={authHeaders} />
      </div>
    </AppShell>
  );
}
