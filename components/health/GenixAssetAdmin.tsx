"use client";

import { FormEvent, useMemo, useState } from "react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";

type UploadSection =
  | "hero"
  | "trust"
  | "problem_solution"
  | "feature"
  | "security"
  | "case_study"
  | "final_cta";

type UploadResponse = {
  bucket: string;
  path: string;
  section: UploadSection;
  publicUrl: string;
  genixAssetMappingKey: string;
};

type Props = {
  requestHeaders: Record<string, string>;
};

const sections: Array<{ value: UploadSection; label: string }> = [
  { value: "hero", label: "Hero" },
  { value: "trust", label: "Trust" },
  { value: "problem_solution", label: "Problem/Solution" },
  { value: "feature", label: "Feature" },
  { value: "security", label: "Security" },
  { value: "case_study", label: "Case Study" },
  { value: "final_cta", label: "Final CTA" }
];

function buildPreviewPayload(section: UploadSection, publicUrl: string) {
  if (section === "hero") {
    return {
      assets: {
        hero_image_url: publicUrl
      }
    };
  }

  return {
    assets: {
      section_images: {
        [section]: publicUrl
      }
    }
  };
}

export default function GenixAssetAdmin({ requestHeaders }: Props) {
  const [section, setSection] = useState<UploadSection>("hero");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<UploadResponse | null>(null);

  const payloadSnippet = useMemo(() => {
    if (!result) return "";
    const payload = buildPreviewPayload(result.section, result.publicUrl);
    return JSON.stringify(
      {
        type: "GENIX_PREVIEW_CONFIG",
        payload
      },
      null,
      2
    );
  }, [result]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setCopied(false);

    if (!file) {
      setError("Please choose an image to upload.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("section", section);
    formData.append("file", file);

    const res = await fetch("/api/media/upload", {
      method: "POST",
      headers: requestHeaders,
      body: formData
    });

    const data = (await res.json().catch(() => null)) as UploadResponse | { error?: string } | null;

    setUploading(false);

    if (!res.ok) {
      setError((data as { error?: string })?.error ?? "Upload failed.");
      return;
    }

    setResult(data as UploadResponse);
  }

  async function copySnippet() {
    if (!payloadSnippet) return;
    try {
      await navigator.clipboard.writeText(payloadSnippet);
      setCopied(true);
    } catch {
      setError("Clipboard copy failed. Copy manually from the snippet box.");
    }
  }

  return (
    <Card>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Genix Asset Admin</h2>
          <p className="mt-1 text-sm text-muted">
            Upload section images and get a ready-to-use preview config payload.
          </p>
        </div>

        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-[220px_1fr_auto] md:items-end">
          <Field label="Section">
            <Select value={section} onChange={(e) => setSection(e.target.value as UploadSection)}>
              {sections.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Image file">
            <input
              type="file"
              accept="image/*"
              className="input-base h-11 py-2"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </Field>

          <Button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </form>

        {result ? <Alert>Upload complete. Use the generated config snippet below.</Alert> : null}
        {error ? <Alert tone="error">{error}</Alert> : null}

        {result ? (
          <div className="grid gap-4">
            <Field label="Public URL">
              <Input value={result.publicUrl} readOnly />
            </Field>

            <Field label="Mapping key">
              <Input value={result.genixAssetMappingKey} readOnly />
            </Field>

            <Field label="Preview config snippet">
              <Textarea rows={10} value={payloadSnippet} readOnly className="font-mono text-xs" />
            </Field>

            <div className="flex items-center gap-3">
              <Button type="button" variant="secondary" onClick={copySnippet}>
                Copy snippet
              </Button>
              {copied ? <span className="text-sm text-muted">Copied.</span> : null}
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
