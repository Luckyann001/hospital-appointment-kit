"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/sections/landing/HeroSection";
import TrustSection from "@/components/sections/landing/TrustSection";
import ProblemSolutionSection from "@/components/sections/landing/ProblemSolutionSection";
import FeatureDeepSection from "@/components/sections/landing/FeatureDeepSection";
import SecuritySection from "@/components/sections/landing/SecuritySection";
import CaseStudySection from "@/components/sections/landing/CaseStudySection";
import FinalCtaSection from "@/components/sections/landing/FinalCtaSection";
import {
  defaultGenixPreviewConfig,
  mergeGenixPreviewConfig,
  type GenixPreviewConfig
} from "@/lib/genix-preview";

export default function LandingPageClient() {
  const [preview, setPreview] = useState<GenixPreviewConfig>(defaultGenixPreviewConfig);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event?.data;
      if (!data || data.type !== "GENIX_PREVIEW_CONFIG") return;
      setPreview((prev) => mergeGenixPreviewConfig(prev, data.payload));
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (preview.theme.font_heading) {
      document.documentElement.style.setProperty("--genix-font-heading", preview.theme.font_heading);
    } else {
      document.documentElement.style.removeProperty("--genix-font-heading");
    }

    if (preview.theme.font_body) {
      document.documentElement.style.setProperty("--genix-font-body", preview.theme.font_body);
    } else {
      document.documentElement.style.removeProperty("--genix-font-body");
    }
  }, [preview.theme.font_body, preview.theme.font_heading]);

  return (
    <main>
      <HeroSection preview={preview} />
      {preview.visibility.show_trust_section ? (
        <TrustSection imageUrl={preview.assets.section_images.trust} />
      ) : null}
      {preview.visibility.show_problem_solution_section ? (
        <ProblemSolutionSection imageUrl={preview.assets.section_images.problem_solution} />
      ) : null}
      {preview.visibility.show_feature_section ? (
        <FeatureDeepSection
          disabledFeatureTitles={preview.visibility.disabled_feature_titles}
          imageUrl={preview.assets.section_images.feature}
        />
      ) : null}
      {preview.visibility.show_security_section ? (
        <SecuritySection imageUrl={preview.assets.section_images.security} />
      ) : null}
      {preview.visibility.show_case_study_section ? (
        <CaseStudySection imageUrl={preview.assets.section_images.case_study} />
      ) : null}
      {preview.visibility.show_final_cta_section ? (
        <FinalCtaSection imageUrl={preview.assets.section_images.final_cta} />
      ) : null}
    </main>
  );
}
