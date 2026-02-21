import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="panel grid" style={{ marginTop: "2rem" }}>
        <h1>AI Healthcare Appointment Kit</h1>
        <p className="muted">
          Privacy-first patient intake, appointment booking, and non-diagnostic AI triage.
        </p>
        <div>
          <Link href="/health">Open healthcare flow</Link>
        </div>
      </section>
    </main>
  );
}
