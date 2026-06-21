// Типы для admin-секций (audit-logs, posts).

import type { Post } from "src/types/domain";

export type { AuditLog } from "src/actions/admin";

export type AuditLogsFilters = {
  action: string;
  targetType: string;
  actorId: string;
};

export interface AdminPostsResponse {
  posts: Post[];
}
