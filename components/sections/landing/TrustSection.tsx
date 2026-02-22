import Container from "@/components/layout/Container";

const items = [
  { label: "Uptime", value: "99.9%" },
  { label: "Encryption", value: "At Rest + In Transit" },
  { label: "Data Protection", value: "Tenant-Isolated Access" },
  { label: "Interoperability", value: "FHIR/HL7 Integration-Ready" }
];

type Props = {
  imageUrl?: string;
};

export default function TrustSection({ imageUrl }: Props) {
  return (
    <section className="border-y border-slate-200 bg-white py-8">
      <Container>
        {imageUrl ? (
          <div className="mb-4 overflow-hidden rounded-xl border border-slate-200">
            <img src={imageUrl} alt="Trust section media" className="h-44 w-full object-cover" />
          </div>
        ) : null}
        <div className="grid gap-4 md:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-primary">{item.value}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
