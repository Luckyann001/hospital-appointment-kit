import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Card from "@/components/ui/Card";
import MotionReveal from "@/components/ui/MotionReveal";

type Props = {
  imageUrl?: string;
};

export default function ProblemSolutionSection({ imageUrl }: Props) {
  return (
    <Section>
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <MotionReveal className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">Operations Challenge</p>
          <h2 className="section-heading max-w-xl">
            Manual scheduling leads to delays, overload, and patient dissatisfaction.
          </h2>
          <p className="section-copy max-w-xl">
            Teams lose hours to repetitive intake handling, fragmented communication, and delayed
            triage handoffs.
          </p>
        </MotionReveal>
        <MotionReveal delay={0.12}>
          <Card className="border-slate-300 p-8">
            {imageUrl ? (
              <div className="mb-4 overflow-hidden rounded-xl border border-slate-200">
                <img src={imageUrl} alt="Problem solution media" className="h-36 w-full object-cover" />
              </div>
            ) : null}
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">AI Workflow Diagram</p>
            <div className="mt-6 grid gap-4">
              <WorkflowStep title="1. Patient Intake" detail="Structured data capture with validation" />
              <WorkflowStep title="2. AI Triage Routing" detail="Priority scoring and queue assignment" />
              <WorkflowStep title="3. Scheduling Engine" detail="Rules-based slot optimization" />
              <WorkflowStep title="4. Clinical Review" detail="Provider approval with full audit trail" />
            </div>
          </Card>
        </MotionReveal>
      </Container>
    </Section>
  );
}

function WorkflowStep({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-sm font-semibold text-primary">{title}</p>
      <p className="mt-1 text-sm text-muted">{detail}</p>
    </div>
  );
}
