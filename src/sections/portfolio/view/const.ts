import { CONFIG } from "src/config-global";

import type { PortfolioMetric } from "./types";

// Person name — proper noun, kept out of the message catalog and interpolated
// into the localized hero eyebrow (`portfolio.heroEyebrow`).
export const PROFILE_NAME = "Михаил Талалаев";

// Резюме: путь к файлу в public/ и имя при скачивании.
// Файл-плейсхолдер лежит в public/assets/cv/ — заменить на актуальный PDF.
export const CV_URL = "/assets/cv/mikhail-talalaev-cv.pdf";
export const CV_DOWNLOAD_NAME = "Mikhail-Talalaev-Software-Engineer.pdf";

export const GITHUB_URL = CONFIG.social.github;

// Labels + copy values are resolved from the `portfolio.metrics.<key>` messages
// in the component. The tech-stack value stays literal here (React/Next.js are
// proper nouns) and short-circuits the message lookup.
export const PORTFOLIO_METRICS: PortfolioMetric[] = [
  {
    key: "experience",
    icon: "solar:clock-circle-bold-duotone",
  },
  {
    key: "specialization",
    icon: "solar:code-square-bold-duotone",
  },
  {
    key: "stack",
    icon: "solar:cpu-bolt-bold-duotone",
    value: "LLM · Claude Code · MCP",
  },
];
