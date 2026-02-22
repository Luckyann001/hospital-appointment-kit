import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Button from "@/components/ui/Button";
import MotionReveal from "@/components/ui/MotionReveal";

type Props = {
  imageUrl?: string;
};

export default function FinalCtaSection({ imageUrl }: Props) {
  return (
    <Section className="pt-8">
      <Container>
        <MotionReveal>
          <div className="rounded-2xl border border-slate-300 bg-white p-10 text-center shadow-soft">
            {imageUrl ? (
              <div className="mx-auto mb-5 max-w-2xl overflow-hidden rounded-xl border border-slate-200">
                <img src={imageUrl} alt="Final CTA media" className="h-44 w-full object-cover" />
              </div>
            ) : null}
            <h2 className="mx-auto max-w-3xl text-4xl font-semibold text-slate-900 md:text-5xl">
              Modernize Your Digital Front Door.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
              Deploy secure AI workflows for intake, triage support, and scheduling with enterprise
              confidence.
            </p>
            <div className="mt-8">
              <Button href="/health" variant="primary">
                Request Demo
              </Button>
            </div>
          </div>
        </MotionReveal>
      </Container>
    </Section>
  );
}
