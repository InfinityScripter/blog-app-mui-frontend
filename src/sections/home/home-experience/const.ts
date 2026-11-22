import type { ExperienceItem } from "./types";

export const DATE_FORMAT = "MMMM YYYY";
// The «present» period word is UI copy → resolved via `home.experience.present`
// in the component and threaded into `getPeriodLabel` (not a static const).

// Localized copy (position, company, location, description bullets) lives in
// `home.experience.items.<key>`; `company` is an impersonal product context,
// not an employer name. Here stay only locale-neutral facts: dates, stack,
// icon and an optional link to an own public resource.
export const EXPERIENCE: ExperienceItem[] = [
  {
    key: "earlier",
    startDate: "2016-03-01",
    endDate: "2022-12-01",
    technologies:
      "TypeScript, React, Redux, REST API, SAP, 1C, SharePoint, SQL",
    icon: "solar:code-square-bold-duotone",
  },
  {
    key: "ecommerce",
    startDate: "2022-11-01",
    endDate: "2024-05-01",
    technologies:
      "JavaScript, TypeScript, React JS, Next.js, Material UI, Git, HTML, CSS, Figma, Webpack, PHP, Twig, Symfony",
    icon: "solar:cart-large-2-bold",
  },
  {
    key: "dentalSaas",
    startDate: "2024-05-01",
    endDate: "2025-04-01",
    technologies:
      "JavaScript, TypeScript, Angular, Git, HTML, CSS, Figma, Webpack, REST API",
    icon: "solar:stethoscope-bold",
  },
  {
    key: "aiPlatform",
    startDate: "2025-04-01",
    endDate: null,
    technologies:
      "TypeScript, React, Ant Design, TanStack Query, Module Federation, LLM",
    icon: "solar:chat-round-dots-bold-duotone",
  },
  {
    key: "aifirst",
    startDate: "2025-01-01",
    endDate: null,
    technologies:
      "TypeScript, Next.js, React, Node.js, PostgreSQL, Anthropic SDK, Gemini, OpenRouter, MCP",
    icon: "solar:global-bold",
    link: "https://aifirst.us.com",
  },
];
