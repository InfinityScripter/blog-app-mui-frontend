import type { HarnessId } from "src/server/llm-stats/types";

export const DAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export const HARNESS_LABEL: Record<HarnessId, string> = {
  "claude-code": "Claude Code",
  codex: "Codex",
  opencode: "OpenCode",
  cursor: "Cursor",
  gemini: "Gemini CLI",
  continue: "Continue",
  goose: "Goose",
  copilot: "Copilot CLI",
};

export const FAMILY_LABEL: Record<string, string> = {
  opus: "Opus",
  sonnet: "Sonnet",
  haiku: "Haiku",
  "gpt-4o": "GPT-4o",
  "gpt-5": "GPT-5",
  o3: "o3",
  o1: "o1",
  codex: "Codex",
  glm: "GLM",
  deepseek: "DeepSeek",
  gemini: "Gemini",
  synthetic: "Synthetic",
};
