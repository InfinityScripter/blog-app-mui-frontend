// Типы для admin-bot-view. Без логики/JSX.

export type ControlProviderName = "glm" | "deepseek" | "openrouter";

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

export type BotModelProbe = {
  provider: string;
  label: string;
  model: string;
  ok: boolean;
  ms: number;
  error?: string;
};

export type BotModelsHealth = {
  healthy: boolean;
  checks: BotModelProbe[];
};
