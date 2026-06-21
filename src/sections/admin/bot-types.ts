// Типы для admin-bot-view. Без логики/JSX.

export type ControlProviderName = "glm" | "deepseek" | "mock";

export type BotModel = {
  id: string;
  tier: "free" | "paid";
  note?: string;
};

export type BotProvider = {
  name: ControlProviderName;
  label: string;
  hasKey: boolean;
};

export type BotStatus = {
  isAlive: boolean;
  provider?: string;
  model?: string;
  isMockEnabled?: boolean;
};
