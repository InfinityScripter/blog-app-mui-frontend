// Типы для admin-audit-logs-view.

export type { AuditLog } from "src/actions/admin";

export type AuditLogsFilters = {
  action: string;
  targetType: string;
  actorId: string;
};
