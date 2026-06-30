import { CONFIG } from "src/config-global";

import type { PortfolioMetric } from "./types";

// Резюме: путь к файлу в public/ и имя при скачивании.
// Файл-плейсхолдер лежит в public/assets/cv/ — заменить на актуальный PDF.
export const CV_URL = "/assets/cv/mikhail-talalaev-cv.pdf";
export const CV_DOWNLOAD_NAME = "Mikhail-Talalaev-Software-Engineer.pdf";

export const GITHUB_URL = CONFIG.social.github;

export const PORTFOLIO_METRICS: PortfolioMetric[] = [
  {
    icon: "solar:clock-circle-bold-duotone",
    label: "Опыт в IT",
    value: "13+ лет",
  },
  {
    icon: "solar:code-square-bold-duotone",
    label: "Специализация",
    value: "Software Engineer",
  },
  {
    icon: "solar:cpu-bolt-bold-duotone",
    label: "Основной стек",
    value: "React · Next.js",
  },
];
