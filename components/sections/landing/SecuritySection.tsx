import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import MotionReveal from "@/components/ui/MotionReveal";

const points = [
  "Encryption at rest and in transit",
  "Role-based permissions with least-privilege access",
  "Immutable audit trail across intake, triage, and scheduling",
  "Compliance-ready infrastructure and data controls"
];

type Props = {
  imageUrl?: string;
};

export default function SecuritySection({ imageUrl }: Props) {
  return (
    <Section dark>
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <MotionReveal className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/70">Security Model</p>
          <h2 className="text-4xl font-semibold text-white md:text-5xl">
            Security is core architecture, not a feature checklist.
          </h2>
          <p className="text-lg leading-relaxed text-white/80">
            Every workflow is designed around trust boundaries, access controls, and compliance
            traceability.
          </p>
        </MotionReveal>
        <MotionReveal delay={0.12}>
          {imageUrl ? (
            <div className="mb-4 overflow-hidden rounded-xl border border-white/20">
              <img src={imageUrl} alt="Security section media" className="h-36 w-full object-cover" />
            </div>
          ) : null}
          <ul className="space-y-3">
            {points.map((point) => (
              <li key={point} className="rounded-xl border border-white/20 bg-white/5 p-4 text-sm text-white">
                {point}
              </li>
            ))}
          </ul>
        </MotionReveal>
      </Container>
    </Section>
  );
}
