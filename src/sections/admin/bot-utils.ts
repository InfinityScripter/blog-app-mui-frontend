// Чистые хелперы для admin-bot-view. Без JSX.

import { TIER_ICON, BOT_PROVIDER_NAMES } from "./bot-const";

import type { BotModel, ControlProviderName } from "./bot-types";

// Цвет чипа здоровья по флагу isAlive.
export function getHealthColor(isAlive: boolean): "success" | "error" {
  return isAlive ? "success" : "error";
}

// Подпись модели: "glm-4.7-flash 🆓 $..." — иконка тира + note.
export function formatModelLabel(model: BotModel): string {
  const icon = TIER_ICON[model.tier];
  return model.note
    ? `${model.id} ${icon} ${model.note}`
    : `${model.id} ${icon}`;
}

// Сужает строку (значение MUI Select) до union провайдера, иначе null.
// Единственная точка приведения — остальной код остаётся без assertions.
export function toControlProvider(value: string): ControlProviderName | null {
  return (BOT_PROVIDER_NAMES as readonly string[]).includes(value)
    ? (value as ControlProviderName)
    : null;
}
