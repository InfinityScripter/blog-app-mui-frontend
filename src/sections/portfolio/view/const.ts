import { CONFIG } from "src/config-global";

import type { PortfolioMetric, PortfolioProject } from "./types";

// Резюме: путь к файлу в public/ и имя при скачивании.
export const CV_URL = "/assets/cv/mikhail-talalaev-cv.pdf";
export const CV_DOWNLOAD_NAME = "Mikhail-Talalaev-CV.pdf";

export const GITHUB_URL = CONFIG.social.github;

// Labels + copy values are resolved from the `portfolio.metrics.<key>` messages
// in the component. The tech-stack value stays literal here (React/Next.js are
// proper nouns) and short-circuits the message lookup.
export const PORTFOLIO_METRICS: PortfolioMetric[] = [
  {
    key: "company",
    icon: "solar:buildings-3-bold-duotone",
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

// Только публичные ресурсы: репозитории открыты, teacher.dog доступен.
export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    key: "aiBotTg",
    name: "ai-bot-tg",
    icon: "solar:chat-round-dots-bold-duotone",
    link: `${GITHUB_URL}/ai-bot-tg`,
    stack: "Node.js · Claude API · OpenAI API · Telegram",
  },
  {
    key: "rokidAi",
    name: "rokid-ai",
    icon: "solar:glasses-bold-duotone",
    link: `${GITHUB_URL}/rokid-ai`,
    stack: "Node.js · LLM · FatSecret API · Telegram",
  },
  {
    key: "claudeControlBar",
    name: "claude-control-bar",
    icon: "solar:widget-5-bold-duotone",
    link: `${GITHUB_URL}/claude-control-bar`,
    stack: "macOS · Claude Code",
  },
  {
    key: "teacherDog",
    name: "teacher.dog",
    icon: "solar:calendar-mark-bold-duotone",
    link: "https://teacher.dog",
    stack: "Next.js · Node.js · PostgreSQL",
  },
];
