// Типы для admin-секций (audit-logs, posts, bot).

import type { Post } from "src/types/domain";

export type { AuditLog } from "src/actions/admin";
// Контракт бот-ручек живёт в слое данных; секция переиспользует типы оттуда.
export type {
  BotModel,
  BotStatus,
  BotModelProbe,
  ControlProviderName,
} from "src/actions/bot";

export type AuditLogsFilters = {
  action: string;
  targetType: string;
  actorId: string;
};

export interface AdminPostsResponse {
  posts: Post[];
}
