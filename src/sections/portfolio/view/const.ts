import { CONFIG } from "src/config-global";

import type { PortfolioMetric } from "./types";

// Резюме: путь к файлу в public/ и имя при скачивании.
export const CV_URL = "/assets/cv/mikhail-talalaev-cv.pdf";
export const CV_DOWNLOAD_NAME = "Mikhail-Talalaev-CV.pdf";

export const GITHUB_URL = CONFIG.social.github;

// Labels + copy values are resolved from the `portfolio.metrics.<key>` messages
// in the component. The tech-stack value stays literal here (React/Next.js are
// proper nouns) and short-circuits the message lookup.
export const PORTFOLIO_METRICS: PortfolioMetric[] = [
  {
    key: "delivery",
    icon: "solar:rocket-2-bold-duotone",
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
