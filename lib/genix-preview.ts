export type GenixPreviewConfig = {
  brand: {
    name: string;
  };
  theme: {
    font_heading: string;
    font_body: string;
  };
  content: {
    hero_title: string;
    hero_subtitle: string;
    primary_cta_label: string;
    secondary_cta_label: string;
    primary_cta_href: string;
    secondary_cta_href: string;
    show_primary_cta: boolean;
    show_secondary_cta: boolean;
  };
  assets: {
    logo_url: string;
    hero_image_url: string;
    section_images: {
      trust: string;
      problem_solution: string;
      feature: string;
      security: string;
      case_study: string;
      final_cta: string;
    };
  };
  visibility: {
    show_trust_section: boolean;
    show_problem_solution_section: boolean;
    show_feature_section: boolean;
    show_security_section: boolean;
    show_case_study_section: boolean;
    show_final_cta_section: boolean;
    disabled_feature_titles: string[];
  };
};

export const defaultGenixPreviewConfig: GenixPreviewConfig = {
  brand: {
    name: "AI Healthcare Appointment Kit"
  },
  theme: {
    font_heading: "",
    font_body: ""
  },
  content: {
    hero_title: "Production-Ready AI Healthcare Appointment Platform",
    hero_subtitle:
      "Reduce front desk workload, improve patient access, and streamline clinical operations in one secure platform.",
    primary_cta_label: "Book Appointment",
    secondary_cta_label: "Healthcare Flow",
    primary_cta_href: "/health",
    secondary_cta_href: "#platform",
    show_primary_cta: true,
    show_secondary_cta: true
  },
  assets: {
    logo_url: "",
    hero_image_url: "",
    section_images: {
      trust: "",
      problem_solution: "",
      feature: "",
      security: "",
      case_study: "",
      final_cta: ""
    }
  },
  visibility: {
    show_trust_section: true,
    show_problem_solution_section: true,
    show_feature_section: true,
    show_security_section: true,
    show_case_study_section: true,
    show_final_cta_section: true,
    disabled_feature_titles: []
  }
};

export function mergeGenixPreviewConfig(
  current: GenixPreviewConfig,
  payload: unknown
): GenixPreviewConfig {
  const cfg = (payload ?? {}) as Record<string, any>;
  return {
    brand: {
      name: cfg?.brand?.name ?? current.brand.name
    },
    theme: {
      font_heading: cfg?.theme?.font_heading ?? current.theme.font_heading,
      font_body: cfg?.theme?.font_body ?? current.theme.font_body
    },
    content: {
      hero_title: cfg?.content?.hero_title ?? current.content.hero_title,
      hero_subtitle: cfg?.content?.hero_subtitle ?? current.content.hero_subtitle,
      primary_cta_label: cfg?.content?.primary_cta_label ?? current.content.primary_cta_label,
      secondary_cta_label: cfg?.content?.secondary_cta_label ?? current.content.secondary_cta_label,
      primary_cta_href: cfg?.content?.primary_cta_href ?? current.content.primary_cta_href,
      secondary_cta_href: cfg?.content?.secondary_cta_href ?? current.content.secondary_cta_href,
      show_primary_cta: cfg?.content?.show_primary_cta ?? current.content.show_primary_cta,
      show_secondary_cta: cfg?.content?.show_secondary_cta ?? current.content.show_secondary_cta
    },
    assets: {
      logo_url: cfg?.assets?.logo_url ?? current.assets.logo_url,
      hero_image_url: cfg?.assets?.hero_image_url ?? current.assets.hero_image_url,
      section_images: {
        trust: cfg?.assets?.section_images?.trust ?? current.assets.section_images.trust,
        problem_solution:
          cfg?.assets?.section_images?.problem_solution ??
          current.assets.section_images.problem_solution,
        feature: cfg?.assets?.section_images?.feature ?? current.assets.section_images.feature,
        security: cfg?.assets?.section_images?.security ?? current.assets.section_images.security,
        case_study:
          cfg?.assets?.section_images?.case_study ?? current.assets.section_images.case_study,
        final_cta: cfg?.assets?.section_images?.final_cta ?? current.assets.section_images.final_cta
      }
    },
    visibility: {
      show_trust_section: cfg?.visibility?.show_trust_section ?? current.visibility.show_trust_section,
      show_problem_solution_section:
        cfg?.visibility?.show_problem_solution_section ??
        current.visibility.show_problem_solution_section,
      show_feature_section:
        cfg?.visibility?.show_feature_section ?? current.visibility.show_feature_section,
      show_security_section:
        cfg?.visibility?.show_security_section ?? current.visibility.show_security_section,
      show_case_study_section:
        cfg?.visibility?.show_case_study_section ?? current.visibility.show_case_study_section,
      show_final_cta_section:
        cfg?.visibility?.show_final_cta_section ?? current.visibility.show_final_cta_section,
      disabled_feature_titles:
        cfg?.visibility?.disabled_feature_titles ?? current.visibility.disabled_feature_titles
    }
  };
}
