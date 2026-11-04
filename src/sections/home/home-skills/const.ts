import type { HomeSkill } from "./types";

// `key` → `home.skills.groups.<key>.name` / `.description` (resolved in
// `HomeSkills` via `useTranslations`). `items`/`iconSkill` are proper-noun tech
// names and icon ids — not translated. Only tech backed by the experience
// timeline / CV goes here.
export const SKILLS: HomeSkill[] = [
  {
    key: "ai",
    icon: "mdi:robot-outline",
    items: [
      "Claude Code",
      "Claude API",
      "OpenAI API",
      "MCP",
      "Tool calling",
      "Local LLM",
    ],
    iconSkill: [
      "logos:claude-icon",
      "logos:anthropic-icon",
      "logos:openai-icon",
      "mdi:connection",
      "mdi:tools",
      "mdi:server-network",
    ],
  },
  {
    key: "frontend",
    icon: "mdi:react",
    items: [
      "React",
      "TypeScript",
      "Next.js",
      "Angular",
      "Material UI",
      "Ant Design",
      "TanStack Query",
      "Module Federation",
    ],
    iconSkill: [
      "logos:react",
      "logos:typescript-icon",
      "logos:nextjs-icon",
      "logos:angular-icon",
      "logos:material-ui",
      "logos:ant-design",
      "logos:react-query-icon",
      "logos:webpack",
    ],
  },
  {
    key: "backend",
    icon: "mdi:database",
    items: ["Node.js", "PostgreSQL", "REST API", "Temporal", "Docker"],
    iconSkill: [
      "logos:nodejs-icon",
      "logos:postgresql",
      "logos:rest",
      "mdi:timer-cog-outline",
      "logos:docker",
    ],
  },
  {
    key: "tools",
    icon: "mdi:tools",
    items: [
      "Git",
      "Webpack",
      "Vitest / Jest",
      "Playwright / Cypress",
      "GitHub Actions",
      "Figma",
      "RUM",
    ],
    iconSkill: [
      "logos:git-icon",
      "logos:webpack",
      "logos:vitest",
      "logos:playwright",
      "logos:github-actions",
      "logos:figma",
      "mdi:chart-line",
    ],
  },
];
