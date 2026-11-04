import { CONFIG } from "src/config-global";

import type { AboutHighlight } from "./types";

export const ABOUT_PROFILE = {
  role: "AI Engineer",
  email: CONFIG.contacts.email,
};

// Section title (`home.about.title`) and lead (`home.about.lead`) are UI copy,
// resolved in `HomeAbout` via `useTranslations`.

/**
 * Сканируемые «факты». `labelKey` → `home.about.highlights.<key>.label`. The
 * focus value is UI copy (`valueKey` → `.value`); the companies value is
 * localized too (company names differ ru/en); the stack value is a proper-noun
 * list kept as-is data.
 */
export const ABOUT_HIGHLIGHTS: AboutHighlight[] = [
  {
    icon: "solar:magic-stick-3-bold-duotone",
    labelKey: "focus",
    valueKey: "focus",
  },
  {
    icon: "solar:cpu-bolt-bold-duotone",
    labelKey: "stack",
    value: "TypeScript · React · Node.js · LLM",
  },
  {
    icon: "solar:buildings-3-bold-duotone",
    labelKey: "companies",
    valueKey: "companies",
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
  "PostgreSQL",
  "Claude Code",
  "MCP",
];
