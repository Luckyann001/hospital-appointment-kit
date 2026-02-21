import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Healthcare Appointment Kit",
  description: "Privacy-first appointment booking and AI-assisted intake triage template"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
