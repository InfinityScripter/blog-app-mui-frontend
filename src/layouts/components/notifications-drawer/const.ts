import type { NotificationKind, NotificationTabValue } from "./types";

// ----------------------------------------------------------------------

export const TABS: { value: NotificationTabValue; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "unread", label: "Новые" },
  { value: "archived", label: "Архив" },
];

/** Subset of theme palette keys — kept narrow so `theme.vars.palette[color]` indexes safely. */
type NotificationAccent = "primary" | "info" | "warning";

interface NotificationKindConfig {
  label: string;
  icon: string;
  color: NotificationAccent;
}

export const KIND_CONFIG: Record<NotificationKind, NotificationKindConfig> = {
  post: {
    label: "Публикация",
    icon: "solar:pen-new-square-bold-duotone",
    color: "primary",
  },
  news: {
    label: "Новость",
    icon: "solar:planet-bold-duotone",
    color: "info",
  },
  release: {
    label: "Релиз модели",
    icon: "solar:cpu-bolt-bold-duotone",
    color: "warning",
  },
};

/**
 * Backend routing marker for news posts (mirrors src/sections/news/const.ts —
 * layouts must not import from sections/).
 */
export const NEWS_TAG = "новости";

/** How many latest posts to pull into the feed (paginated path = newest first). */
export const POSTS_FEED_LIMIT = 15;

/** Merged feed cap: keeps the drawer scannable and the stored id lists bounded. */
export const MAX_NOTIFICATIONS = 30;

export const NOTIFICATIONS_STORAGE_KEY = "notifications-state";
