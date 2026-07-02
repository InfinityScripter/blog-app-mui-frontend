"use client";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import Drawer from "@mui/material/Drawer";
import SvgIcon from "@mui/material/SvgIcon";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "src/routes/hooks";
import { useState, useCallback } from "react";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { varHover } from "src/components/animate";
import { useBoolean } from "src/hooks/use-boolean";
import { Scrollbar } from "src/components/scrollbar";

import { NotificationItem } from "./notification-item";
import { NotificationTabs } from "./notification-tabs";
import { NotificationEmpty } from "./notification-empty";
import { useNotifications } from "./hooks/use-notifications";
import { NotificationSkeleton } from "./notification-skeleton";

import type {
  AppNotification,
  NotificationTabValue,
  NotificationsDrawerProps,
} from "./types";

// ----------------------------------------------------------------------

export function NotificationsDrawer({
  sx,
  ...other
}: NotificationsDrawerProps) {
  const drawer = useBoolean();

  const router = useRouter();

  const [currentTab, setCurrentTab] = useState<NotificationTabValue>("all");

  const {
    active,
    unread,
    archived,
    unreadCount,
    isLoading,
    hasError,
    isRead,
    isArchived,
    markRead,
    markAllRead,
    toggleArchive,
  } = useNotifications();

  const handleOpenNotification = useCallback(
    (notification: AppNotification) => {
      markRead(notification.id);
      drawer.onFalse();
      router.push(notification.href);
    },
    [drawer, markRead, router],
  );

  const itemsByTab: Record<NotificationTabValue, AppNotification[]> = {
    all: active,
    unread,
    archived,
  };

  const currentItems = itemsByTab[currentTab];

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{ py: 2, pl: 2.5, pr: 1.5, minHeight: 68 }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Уведомления
      </Typography>

      {unreadCount > 0 && (
        <Tooltip title="Прочитать все">
          <IconButton color="primary" onClick={markAllRead}>
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      )}

      <IconButton
        onClick={drawer.onFalse}
        sx={{ display: { xs: "inline-flex", sm: "none" } }}
      >
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );

  const renderList = (
    <Scrollbar sx={{ flexGrow: 1 }}>
      {currentItems.length ? (
        <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
          {currentItems.map((notification) => (
            <Box component="li" key={notification.id} sx={{ display: "flex" }}>
              <NotificationItem
                notification={notification}
                isUnread={!isRead(notification.id)}
                isArchived={isArchived(notification.id)}
                onOpen={handleOpenNotification}
                onToggleArchive={toggleArchive}
              />
            </Box>
          ))}
        </Box>
      ) : (
        <NotificationEmpty tab={currentTab} hasError={hasError} />
      )}
    </Scrollbar>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={drawer.onTrue}
        aria-label="Уведомления"
        sx={sx}
        {...other}
      >
        <Badge badgeContent={unreadCount} color="error">
          <SvgIcon>
            {/* https://icon-sets.iconify.design/solar/bell-bing-bold-duotone/ */}
            <path
              fill="currentColor"
              d="M18.75 9v.704c0 .845.24 1.671.692 2.374l1.108 1.723c1.011 1.574.239 3.713-1.52 4.21a25.794 25.794 0 0 1-14.06 0c-1.759-.497-2.531-2.636-1.52-4.21l1.108-1.723a4.393 4.393 0 0 0 .693-2.374V9c0-3.866 3.022-7 6.749-7s6.75 3.134 6.75 7"
              opacity="0.5"
            />
            <path
              fill="currentColor"
              d="M12.75 6a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0zM7.243 18.545a5.002 5.002 0 0 0 9.513 0c-3.145.59-6.367.59-9.513 0"
            />
          </SvgIcon>
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 1, maxWidth: 420 } }}
      >
        {renderHead}

        <NotificationTabs
          value={currentTab}
          onChange={setCurrentTab}
          counts={{
            all: active.length,
            unread: unread.length,
            archived: archived.length,
          }}
        />

        {isLoading ? <NotificationSkeleton /> : renderList}
      </Drawer>
    </>
  );
}
