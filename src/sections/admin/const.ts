// Статические данные для admin-audit-logs-view. Без логики/JSX.

export const AUDIT_TABLE_HEAD = [
  "Время",
  "Действие",
  "Актор",
  "Target",
  "IP",
] as const;

// Известные действия (бэкенд, dot.case). Для Select-фильтра.
export const AUDIT_ACTION_OPTIONS = [
  "auth.login.succeeded",
  "auth.login.failed",
  "post.created",
  "post.updated",
  "post.deleted",
  "post.publish_changed",
  "comment.created",
  "comment.updated",
  "comment.deleted",
  "user.deleted",
  "kanban.board.created",
  "kanban.board.deleted",
  "kanban.column.created",
  "kanban.column.deleted",
  "kanban.task.created",
  "kanban.task.deleted",
  "calendar.event.created",
  "calendar.event.updated",
  "calendar.event.deleted",
  "chat.channel.created",
] as const;

// Известные типы target. Для Select-фильтра.
export const AUDIT_TARGET_TYPE_OPTIONS = [
  "post",
  "user",
  "comment",
  "board",
  "column",
  "task",
  "calendar_event",
  "chat_channel",
] as const;

export const AUDIT_ROWS_PER_PAGE_OPTIONS = [25, 50, 100];
export const AUDIT_DEFAULT_ROWS_PER_PAGE = 50;
