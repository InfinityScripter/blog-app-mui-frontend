// Чистые хелперы admin-секций (audit-logs, bot). Без JSX.

import { TIER_ICON, BOT_PROVIDER_NAMES } from "./const";

import type { AuditLog, BotModel, ControlProviderName } from "./types";

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

// ----------------------------------------------------------------------

// metadata → короткий JSON для caption. Пустой объект → "".
export function formatAuditMetadata(metadata: Record<string, unknown>): string {
  if (!metadata || Object.keys(metadata).length === 0) return "";
  return JSON.stringify(metadata);
}

// Актор + роль одной строкой: "uuid (admin)" / "система" если actorId null.
export function formatAuditActor(log: AuditLog): string {
  if (!log.actorId) return "система";
  return log.actorRole ? `${log.actorId} (${log.actorRole})` : log.actorId;
}

// Target одной строкой: "post / uuid" / "—" если нет.
export function formatAuditTarget(log: AuditLog): string {
  if (!log.targetType && !log.targetId) return "—";
  return [log.targetType, log.targetId].filter(Boolean).join(" / ");
}
