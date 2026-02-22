import type { ReactNode } from "react";
import Link from "next/link";
import type { Route } from "next";
import { cn } from "@/lib/utils";
import { Activity, LayoutDashboard } from "lucide-react";

type Props = {
  title: string;
  subtitle: string;
  role: "patient" | "provider";
  activeHref?: string;
  children: ReactNode;
};

const baseNavItems = [
  { href: "/", label: "Overview" },
  { href: "/health", label: "Healthcare Ops" }
];

export default function AppShell({ title, subtitle, role, activeHref, children }: Props) {
  const navItems =
    role === "provider"
      ? [...baseNavItems, { href: "/health/admin/assets", label: "Asset Admin" }]
      : baseNavItems;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 md:grid-cols-[250px_1fr]">
        <aside className="border-r border-slate-200 bg-white p-6">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
            <LayoutDashboard className="h-4 w-4" />
            AI Healthcare Suite
          </p>
          <h1 className="mt-2 text-xl font-semibold text-primary">Operations Console</h1>
          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href as Route}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm font-medium transition",
                  item.href === (activeHref ?? "/health")
                    ? "bg-primary text-white"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Active role</p>
            <p className="mt-1 text-sm font-semibold text-primary">{role}</p>
          </div>
        </aside>

        <div className="p-6 md:p-8">
          <header className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-3xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted">
              <Activity className="h-4 w-4" />
              {subtitle}
            </p>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
