// Чистые хелперы для admin-audit-logs-view. Без JSX.

import type { AuditLog } from "./types";

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
