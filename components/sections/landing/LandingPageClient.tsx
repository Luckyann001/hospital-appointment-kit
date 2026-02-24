"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  CalendarClock,
  Clock3,
  FileText,
  HeartPulse,
  Lock,
  Shield
} from "lucide-react";
import {
  defaultGenixPreviewConfig,
  mergeGenixPreviewConfig,
  type GenixPreviewConfig
} from "@/lib/genix-preview";

const featureCards = [
  {
    icon: FileText,
    title: "FHIR/HL7 Integration",
    description:
      "Standards-compliant healthcare data exchange. Seamless integration with existing EHR systems."
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "Role-based access control, SSO integration, and comprehensive security audit trails."
  },
  {
    icon: Clock3,
    title: "Real-Time Dashboard",
    description: "Monitor operations in real-time with comprehensive analytics and actionable insights."
  }
];

const footerColumns = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Security", "Compliance"]
  },
  {
    title: "Resources",
    links: ["Documentation", "API Reference", "Support", "Status"]
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Contact"]
  }
];

export default function LandingPageClient() {
  const [preview, setPreview] = useState<GenixPreviewConfig>(defaultGenixPreviewConfig);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event?.data;
      if (!data || data.type !== "GENIX_PREVIEW_CONFIG") return;
      setPreview((prev) => mergeGenixPreviewConfig(prev, data.payload));
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (preview.theme.font_heading) {
      document.documentElement.style.setProperty("--genix-font-heading", preview.theme.font_heading);
    } else {
      document.documentElement.style.removeProperty("--genix-font-heading");
    }

    if (preview.theme.font_body) {
      document.documentElement.style.setProperty("--genix-font-body", preview.theme.font_body);
    } else {
      document.documentElement.style.removeProperty("--genix-font-body");
    }
  }, [preview.theme.font_body, preview.theme.font_heading]);

  return (
    <main className="min-h-screen bg-[#f2f5f9] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {preview.assets.logo_url ? (
              <img
                src={preview.assets.logo_url}
                alt={`${preview.brand.name} logo`}
                className="h-9 w-9 rounded-lg border border-slate-200 object-cover"
              />
            ) : (
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <HeartPulse className="h-5 w-5" />
              </span>
            )}
            <span className="text-3xl font-semibold leading-none text-primary">{preview.brand.name}</span>
          </div>

          <nav className="hidden items-center gap-8 text-lg text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-slate-900">
              Features
            </a>
            <a href="#pricing" className="transition hover:text-slate-900">
              Pricing
            </a>
            <a href="#docs" className="transition hover:text-slate-900">
              Docs
            </a>
            <Link
              href="/health"
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-base font-medium text-slate-900"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-slate-200 pb-14 pt-12">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <span>HIPAA-Compliant</span>
              <span className="text-slate-300">•</span>
              <span>AI-Powered</span>
              <span className="text-slate-300">•</span>
              <span>Enterprise-Ready</span>
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-600">AI Healthcare Appointment Kit</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-[1.06] text-primary lg:text-6xl">
              {preview.content.hero_title}
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-600">{preview.content.hero_subtitle}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary">
                FHIR/HL7 Ready
              </span>
              <span className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary">
                Audit Logging
              </span>
              <span className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary">
                Tenant-Isolated
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              {preview.content.show_primary_cta ? (
                <a
                  href={preview.content.primary_cta_href}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-accent px-8 text-lg font-semibold text-white"
                >
                  {preview.content.primary_cta_label}
                </a>
              ) : null}
              {preview.content.show_secondary_cta ? (
                <a
                  href={preview.content.secondary_cta_href}
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-8 text-lg font-semibold text-slate-900"
                >
                  {preview.content.secondary_cta_label}
                </a>
              ) : null}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
            <h2 className="text-4xl font-bold text-primary">Hospital Operations Dashboard</h2>
            <p className="mt-2 text-xl text-slate-600">Real-time operational insights</p>

            <div className="mt-7 grid grid-cols-3 gap-4">
              <MetricCard icon={Activity} label="Intake Queue" value="127" />
              <MetricCard icon={CalendarClock} label="Booked" value="94" />
              <MetricCard icon={Shield} label="Escalations" value="11" />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">Scheduling Throughput</p>
              <div className="mt-4 h-2.5 rounded-full bg-slate-200">
                <div className="h-2.5 w-[74%] rounded-full bg-accent" />
              </div>
              <p className="mt-3 text-base text-slate-600">74% appointments auto-routed</p>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-2xl font-semibold text-primary">Next Priority Case</p>
              <p className="mt-2 text-lg text-slate-600">Respiratory triage review • Room 4</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24">
        <div className="mx-auto w-full max-w-7xl px-6">
          <h2 className="text-center text-4xl font-bold text-primary md:text-5xl">
            Enterprise-Grade Healthcare Platform
          </h2>
          <p className="mt-3 text-center text-xl text-slate-600">
            Built for healthcare providers who demand the best
          </p>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="rounded-3xl border border-slate-200 bg-white p-8">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 text-accent">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-3xl font-bold text-primary">{feature.title}</h3>
                  <p className="mt-4 text-lg leading-relaxed text-slate-600">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="rounded-[28px] bg-[#0b9a91] px-8 py-14 text-center text-white">
            <h2 className="text-4xl font-bold md:text-5xl">Ready to Transform Your Healthcare Operations?</h2>
            <p className="mt-3 text-xl text-white/90">Join leading healthcare providers using HealthFlow AI</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/health"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-8 text-lg font-semibold text-[#0b9a91]"
              >
                Start Free Trial
              </Link>
              <a
                href="#docs"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/60 bg-white/15 px-8 text-lg font-semibold text-white"
              >
                Book Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer id="docs" className="border-t border-slate-300 bg-[#eef2f7]">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <HeartPulse className="h-5 w-5 text-accent" />
              <span className="text-3xl font-semibold">HealthFlow AI</span>
            </div>
            <p className="mt-4 max-w-xs text-base leading-relaxed text-slate-600">
              Enterprise healthcare appointment platform for modern healthcare providers.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-3xl font-semibold text-slate-900">{column.title}</h3>
              <ul className="mt-4 space-y-2 text-base text-slate-600">
                {column.links.map((link) => (
                  <li key={link}>{link}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-300 py-5 text-center text-sm text-slate-600">
          © 2026 HealthFlow AI. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Activity;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="flex items-center gap-2 text-sm text-slate-600">
        <Icon className="h-4 w-4" />
        {label}
      </p>
      <p className="mt-2 text-4xl font-bold text-primary">{value}</p>
    </div>
  );
}
