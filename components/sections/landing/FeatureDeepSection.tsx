import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Card from "@/components/ui/Card";
import MotionReveal from "@/components/ui/MotionReveal";

const sections = [
  {
    title: "AI Triage & Smart Routing",
    copy: "Non-diagnostic AI evaluates reported symptoms and routes patients to the right queue.",
    bullets: [
      "Symptom severity scoring",
      "Priority-based routing",
      "Provider-ready summaries"
    ]
  },
  {
    title: "Intelligent Scheduling Engine",
    copy: "Automates appointment placement using provider availability, visit type, and urgency.",
    bullets: ["Real-time slot optimization", "Telehealth/in-person support", "Reduced no-show risk"]
  },
  {
    title: "Secure Role-Based Access & Audit Logs",
    copy: "Restricts sensitive actions by role and records every workflow event for traceability.",
    bullets: ["Patient/provider permission scopes", "Immutable action history", "Compliance reporting"]
  }
];

type Props = {
  disabledFeatureTitles?: string[];
  imageUrl?: string;
};

export default function FeatureDeepSection({ disabledFeatureTitles = [], imageUrl }: Props) {
  const visibleSections = sections.filter(
    (section) => !disabledFeatureTitles.includes(section.title)
  );

  if (visibleSections.length === 0) return null;

  return (
    <Section id="platform">
      <Container className="space-y-12">
        <MotionReveal className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">Platform Depth</p>
          <h2 className="section-heading">Built for hospital operations, not generic demos.</h2>
        </MotionReveal>

        {imageUrl ? (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <img src={imageUrl} alt="Feature section media" className="h-52 w-full object-cover" />
          </div>
        ) : null}

        <div className="space-y-8">
          {visibleSections.map((section, index) => (
            <MotionReveal key={section.title} delay={index * 0.08}>
              <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-3xl font-semibold text-slate-900">{section.title}</h3>
                  <p className="text-base leading-relaxed text-muted">{section.copy}</p>
                  <ul className="space-y-2">
                    {section.bullets.map((item) => (
                      <li key={item} className="text-sm text-slate-700">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Card className="h-full border-slate-200 bg-slate-50 p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Module Preview</p>
                  <div className="mt-4 grid gap-3">
                    <div className="h-12 rounded-lg border border-slate-200 bg-white" />
                    <div className="h-12 rounded-lg border border-slate-200 bg-white" />
                    <div className="h-24 rounded-lg border border-slate-200 bg-white" />
                  </div>
                </Card>
              </div>
            </MotionReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
