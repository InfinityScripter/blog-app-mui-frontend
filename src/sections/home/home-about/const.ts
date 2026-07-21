import { CONFIG } from "src/config-global";

import type { AboutHighlight } from "./types";

export const ABOUT_PROFILE = {
  name: "Михаил Талалаев",
  role: "AI Engineer",
  email: CONFIG.contacts.email,
  imageSrc: "/assets/images/about/developer.webp",
  imageAlt: "Михаил Талалаев",
};

// Section title (`home.about.title`) and lead (`home.about.lead`) are UI copy,
// resolved in `HomeAbout` via `useTranslations`.

/**
 * Сканируемые «факты». `labelKey` → `home.about.highlights.<key>.label`. The
 * experience value is UI copy (`valueKey` → `.value`); the stack/company values
 * are proper-noun lists kept as-is data.
 */
export const ABOUT_HIGHLIGHTS: AboutHighlight[] = [
  {
    icon: "solar:clock-circle-bold-duotone",
    labelKey: "experience",
    valueKey: "experience",
  },
  {
    icon: "solar:cpu-bolt-bold-duotone",
    labelKey: "stack",
    value: "React · TypeScript · Next.js",
  },
  {
    icon: "solar:buildings-3-bold-duotone",
    labelKey: "companies",
    value: "Яндекс · СТОМПЛАН · ShurikMarket",
  },
];

/** Технологии-чипы под лидом — короткий и честный список основного стека. */
export const ABOUT_STACK = [
  "React",
  "TypeScript",
  "Next.js",
  "Angular",
  "Node.js",
  "Material UI",
  "Redux",
  "Claude Code",
  "MCP",
];
