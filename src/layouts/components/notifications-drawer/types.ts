import type { Theme, SxProps } from "@mui/material/styles";

// ----------------------------------------------------------------------

export type NotificationKind = "post" | "news" | "release";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  /** Headline — post title or model name. */
  message: string;
  /** Secondary line — author for posts, verdict/source for releases. */
  meta: string;
  /** Post cover; null renders the kind icon chip instead. */
  coverUrl: string | null;
  href: string;
  createdAt: string;
}

export type NotificationTabValue = "all" | "unread" | "archived";

/** Read/archive marks persisted in localStorage (ids of feed items). */
export interface NotificationsReadState {
  readIds: string[];
  archivedIds: string[];
}

export interface NotificationItemProps {
  notification: AppNotification;
  isUnread: boolean;
  isArchived: boolean;
  onOpen: (notification: AppNotification) => void;
  onToggleArchive: (id: string) => void;
}

export interface NotificationEmptyProps {
  tab: NotificationTabValue;
  hasError: boolean;
}

export interface NotificationTabsProps {
  value: NotificationTabValue;
  counts: Record<NotificationTabValue, number>;
  onChange: (value: NotificationTabValue) => void;
}

export interface NotificationsDrawerProps {
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}
