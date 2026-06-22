// Статические данные для admin-bot-view. Без логики/JSX.

import type { ControlProviderName } from "./bot-types";

export const BOT_PROVIDER_NAMES: readonly ControlProviderName[] = [
  "glm",
  "deepseek",
  "openrouter",
] as const;

export const TIER_ICON: Record<"free" | "paid", string> = {
  free: "🆓",
  paid: "💲",
};
