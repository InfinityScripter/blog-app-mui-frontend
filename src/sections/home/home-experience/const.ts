import { CONFIG } from "src/config-global";

import type { ExperienceItem } from "./types";

export const DATE_FORMAT = "MMMM YYYY";
// The «present» period word is UI copy → resolved via `home.experience.present`
// in the component and threaded into `getPeriodLabel` (not a static const).

// Localized copy (position, company, location, description bullets) lives in
// `home.experience.items.<key>` — ru from the site, en from the PDF CV. Here
// stay only locale-neutral facts: dates, stack, logo, link.
export const EXPERIENCE: ExperienceItem[] = [
  {
    key: "gazprom",
    startDate: "2016-03-01",
    endDate: "2022-09-01",
    technologies: "SAP, 1C, Microsoft SharePoint, SQL",
    logo: "/assets/icons/experience/gazprom.svg",
    link: "https://pererabotka.gazprom.ru",
  },
  {
    key: "qcup",
    startDate: "2021-11-01",
    endDate: "2022-12-01",
    technologies:
      "JavaScript, TypeScript, React, Redux, Material UI, Git, HTML, CSS, Figma, REST API",
    logo: "/assets/icons/experience/qcup.svg",
    link: CONFIG.social.github,
  },
  {
    key: "userver",
    startDate: "2023-05-01",
    endDate: "2023-10-01",
    technologies: "JavaScript, Git, HTML, CSS, Figma, jQuery",
    logo: "/assets/icons/experience/yandex.png",
    link: "https://userver.tech",
  },
  {
    key: "shurikmarket",
    startDate: "2022-11-01",
    endDate: "2024-05-01",
    technologies:
      "JavaScript, TypeScript, React JS, Next.js, Material UI, Git, HTML, CSS, Figma, Webpack, PHP, Twig, Symfony",
    logo: "/assets/icons/experience/shurikmarket.ico",
    link: "https://shurik.market",
  },
  {
    key: "stomplan",
    startDate: "2024-05-01",
    endDate: "2025-04-01",
    technologies:
      "JavaScript, TypeScript, Angular, Git, HTML, CSS, Figma, Webpack, REST API",
    logo: "/assets/icons/experience/stomplan.ico",
    link: "https://stomplan.ru",
  },
  {
    key: "yandexGo",
    startDate: "2025-04-01",
    endDate: null,
    technologies:
      "TypeScript, React, Ant Design, TanStack Query, Module Federation, LLM",
    logo: "/assets/icons/experience/yandex.png",
    link: "https://go.yandex",
  },
  {
    key: "aifirst",
    startDate: "2025-01-01",
    endDate: null,
    technologies:
      "TypeScript, Next.js, React, Node.js, PostgreSQL, Claude API, OpenAI API, MCP",
    logo: "/favicon.ico",
    link: "https://aifirst.us.com",
  },
];
