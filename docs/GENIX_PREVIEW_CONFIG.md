# GENIX Preview Config

The landing page listens for this event:

```js
window.postMessage({ type: "GENIX_PREVIEW_CONFIG", payload: { ... } }, "*")
```

## Supported fields

```ts
{
  brand: { name?: string },
  theme: {
    font_heading?: string,
    font_body?: string,
  },
  content: {
    hero_title?: string,
    hero_subtitle?: string,
    primary_cta_label?: string,
    secondary_cta_label?: string,
    primary_cta_href?: string,
    secondary_cta_href?: string,
    show_primary_cta?: boolean,
    show_secondary_cta?: boolean,
  },
  assets: {
    logo_url?: string,
    hero_image_url?: string,
    section_images?: {
      trust?: string,
      problem_solution?: string,
      feature?: string,
      security?: string,
      case_study?: string,
      final_cta?: string,
    }
  },
  visibility: {
    show_trust_section?: boolean,
    show_problem_solution_section?: boolean,
    show_feature_section?: boolean,
    show_security_section?: boolean,
    show_case_study_section?: boolean,
    show_final_cta_section?: boolean,
    disabled_feature_titles?: string[],
  }
}
```

## Example

```js
window.postMessage(
  {
    type: "GENIX_PREVIEW_CONFIG",
    payload: {
      brand: { name: "Genix Care Cloud" },
      content: {
        hero_title: "Enterprise Patient Flow Platform",
        show_secondary_cta: false,
        primary_cta_label: "Book Appointment",
        primary_cta_href: "/health"
      },
      assets: {
        logo_url: "https://example.com/logo.png",
        section_images: {
          feature: "https://example.com/feature-banner.jpg",
          security: "https://example.com/security-banner.jpg"
        }
      },
      visibility: {
        disabled_feature_titles: ["Intelligent Scheduling Engine"],
        show_case_study_section: false
      }
    }
  },
  "*"
);
```
