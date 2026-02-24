import type { ReactNode } from "react";
import Link from "next/link";
import type { Route } from "next";
import { cn } from "@/lib/utils";
import {
  Activity,
  Calendar,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Settings,
  SquareKanban,
  Users,
  ArrowLeft
} from "lucide-react";

type Props = {
  title: string;
  subtitle: string;
  role: "patient" | "provider";
  activeHref?: string;
  children: ReactNode;
};

const navItems = [
  { href: "/", label: "Overview", icon: SquareKanban },
  { href: "/health", label: "Healthcare Ops", icon: Activity },
  { href: "#", label: "Appointments", icon: Calendar },
  { href: "#", label: "Patients", icon: Users },
  { href: "#", label: "Settings", icon: Settings }
] as const;

export default function AppShell({ title, subtitle, role, activeHref, children }: Props) {
  return (
    <div className="min-h-screen bg-[#eef2f6]">
      <div className="mx-auto grid min-h-screen w-full max-w-none grid-cols-1 lg:grid-cols-[256px_1fr]">
        <aside className="bg-[#0b1338] px-6 py-7 text-slate-100">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-cyan-300">
            <LayoutDashboard className="h-4 w-4" />
            AI Healthcare Suite
          </p>
          <h1 className="mt-3 text-4xl font-semibold">Operations Console</h1>

          <nav className="mt-10 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href !== "#" && item.href === (activeHref ?? "/health");

              if (item.href === "#") {
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-lg text-slate-200"
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href as Route}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-lg transition",
                    isActive ? "bg-[#1d2a54] text-white" : "text-slate-200 hover:bg-[#18254a]"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 rounded-2xl bg-[#1c284b] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">Active role</p>
            <p className="mt-2 text-2xl font-semibold lowercase">{role}</p>
          </div>

          <div className="mt-6 space-y-3">
            <button className="flex items-center gap-3 text-lg text-slate-200 transition hover:text-white" type="button">
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </button>
            <button className="flex items-center gap-3 text-lg text-slate-200 transition hover:text-white" type="button">
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </aside>

        <div className="px-6 py-7 lg:px-8 lg:py-8">
          <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-3xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <HeartPulse className="h-4 w-4 text-accent" />
              {subtitle}
            </p>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
