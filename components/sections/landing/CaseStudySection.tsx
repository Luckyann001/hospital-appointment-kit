import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Card from "@/components/ui/Card";
import MotionReveal from "@/components/ui/MotionReveal";

type Props = {
  imageUrl?: string;
};

export default function CaseStudySection({ imageUrl }: Props) {
  return (
    <Section>
      <Container>
        <MotionReveal>
          <Card className="grid gap-6 border-slate-300 p-8 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted">Case Study</p>
              <h2 className="section-heading">Clinic reduced scheduling time by 42% in 8 weeks.</h2>
              <p className="section-copy">
                By replacing manual triage handoff and phone-first scheduling with AI-assisted intake
                and routing.
              </p>
              <p className="text-sm text-muted">
                Pilot profile: 3 outpatient clinics, 22 front-desk staff, mixed telehealth/in-person workflow.
              </p>
            </div>
            <div className="grid gap-3">
              {imageUrl ? (
                <div className="mb-1 overflow-hidden rounded-xl border border-slate-200">
                  <img src={imageUrl} alt="Case study media" className="h-24 w-full object-cover" />
                </div>
              ) : null}
              <MetricRow label="Scheduling Time" value="-42%" />
              <MetricRow label="Front Desk Calls" value="-31%" />
              <MetricRow label="Patient Access" value="+27%" />
            </div>
          </Card>
        </MotionReveal>
      </Container>
    </Section>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-base font-semibold text-primary">{value}</span>
    </div>
  );
}
