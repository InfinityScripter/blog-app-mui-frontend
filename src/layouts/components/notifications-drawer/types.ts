import type { Theme, SxProps } from "@mui/material/styles";

// ----------------------------------------------------------------------

export interface NotificationItemData {
  id: string;
  isUnRead: boolean;
  type: string;
  title: string;
  category?: string;
  createdAt: string | Date;
  avatarUrl: string | null;
}

export interface NotificationItemProps {
  notification: NotificationItemData;
}

export interface NotificationsDrawerProps {
  data?: NotificationItemData[];
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}
