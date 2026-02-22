"use client";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import MotionReveal from "@/components/ui/MotionReveal";
import { Activity, ShieldCheck, Stethoscope } from "lucide-react";
import type { ReactNode } from "react";
import type { GenixPreviewConfig } from "@/lib/genix-preview";

type Props = {
  preview: GenixPreviewConfig;
};

export default function HeroSection({ preview }: Props) {
  return (
    <Section className="relative overflow-hidden pb-16 pt-16 md:pt-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <MotionReveal className="space-y-8">
          <div className="flex items-center gap-3">
            {preview.assets.logo_url ? (
              <img
                src={preview.assets.logo_url}
                alt={`${preview.brand.name} logo`}
                className="h-9 w-9 rounded-lg border border-slate-200 bg-white object-cover"
              />
            ) : null}
            <Badge>HIPAA-Compliant • AI-Powered • Enterprise-Ready</Badge>
          </div>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">{preview.brand.name}</p>
          <h1 className="max-w-xl text-5xl font-bold leading-tight text-slate-900 md:text-6xl">
            {preview.content.hero_title}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted">
            {preview.content.hero_subtitle}
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
            <span className="rounded-md border border-slate-200 px-2 py-1">FHIR/HL7 Ready</span>
            <span className="rounded-md border border-slate-200 px-2 py-1">Audit Logging</span>
            <span className="rounded-md border border-slate-200 px-2 py-1">Tenant-Isolated</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {preview.content.show_primary_cta ? (
              <Button href={preview.content.primary_cta_href} variant="primary">
                {preview.content.primary_cta_label}
              </Button>
            ) : null}
            {preview.content.show_secondary_cta ? (
              <Button href={preview.content.secondary_cta_href} variant="secondary">
                {preview.content.secondary_cta_label}
              </Button>
            ) : null}
          </div>
        </MotionReveal>

        <MotionReveal className="relative" delay={0.12}>
          <div className="absolute -left-4 top-12 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
          <Card className="relative z-10 animate-float border-slate-300 p-0 shadow-soft">
            <div className="border-b border-slate-200 px-6 py-4">
              <p className="text-sm font-semibold text-primary">Hospital Operations Dashboard</p>
            </div>
            <div className="grid gap-4 p-6">
              <div className="grid grid-cols-3 gap-3">
                <Metric title="Intake Queue" value="127" icon={<Activity className="h-4 w-4" />} />
                <Metric title="Booked" value="94" icon={<Stethoscope className="h-4 w-4" />} />
                <Metric title="Escalations" value="11" icon={<ShieldCheck className="h-4 w-4" />} />
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Scheduling Throughput
                </p>
                <div className="mt-3 h-2 rounded-full bg-slate-200">
                  <div className="h-2 w-3/4 rounded-full bg-accent" />
                </div>
                <p className="mt-2 text-xs text-muted">74% appointments auto-routed</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-medium text-primary">Next Priority Case</p>
                <p className="mt-1 text-sm text-muted">Respiratory triage review • Room 4</p>
              </div>
              {preview.assets.hero_image_url ? (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <img
                    src={preview.assets.hero_image_url}
                    alt="Hero preview"
                    className="h-36 w-full object-cover"
                  />
                </div>
              ) : null}
            </div>
          </Card>
        </MotionReveal>
      </Container>
    </Section>
  );
}

function Metric({ title, value, icon }: { title: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="flex items-center gap-1 text-xs text-muted">
        {icon}
        {title}
      </p>
      <p className="mt-2 text-2xl font-semibold text-primary">{value}</p>
    </div>
  );
}
