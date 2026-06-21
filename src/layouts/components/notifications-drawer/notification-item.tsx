import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { CONFIG } from "src/config-global";
import { fToNow } from "src/utils/format-time";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";

import { reader } from "./utils";
import { FileAction } from "./file-action";
import { TagsAction } from "./tags-action";
import { FriendAction } from "./friend-action";
import { PaymentAction } from "./payment-action";
import { ProjectAction } from "./project-action";

import type { NotificationItemProps } from "./types";

// ----------------------------------------------------------------------

export type { NotificationItemData } from "./types";

export function NotificationItem({ notification }: NotificationItemProps) {
  const renderAvatar = (
    <ListItemAvatar>
      {notification.avatarUrl ? (
        <Avatar
          src={notification.avatarUrl}
          sx={{ bgcolor: "background.neutral" }}
        />
      ) : (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: "background.neutral",
          }}
        >
          <Box
            component="img"
            src={`${CONFIG.site.basePath}/assets/icons/notification/${(notification.type === "order" && "ic-order") || (notification.type === "chat" && "ic-chat") || (notification.type === "mail" && "ic-mail") || (notification.type === "delivery" && "ic-delivery")}.svg`}
            sx={{ width: 24, height: 24 }}
          />
        </Stack>
      )}
    </ListItemAvatar>
  );

  const renderText = (
    <ListItemText
      disableTypography
      primary={reader(notification.title)}
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          sx={{ typography: "caption", color: "text.disabled" }}
          divider={
            <Box
              sx={{
                width: 2,
                height: 2,
                bgcolor: "currentColor",
                mx: 0.5,
                borderRadius: "50%",
              }}
            />
          }
        >
          {fToNow(notification.createdAt)}
          {notification.category}
        </Stack>
      }
    />
  );

  const renderUnReadBadge = notification.isUnRead && (
    <Box
      sx={{
        top: 26,
        width: 8,
        height: 8,
        right: 20,
        borderRadius: "50%",
        bgcolor: "info.main",
        position: "absolute",
      }}
    />
  );

  return (
    <ListItemButton
      disableRipple
      sx={{
        p: 2.5,
        alignItems: "flex-start",
        borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
      }}
    >
      {renderUnReadBadge}

      {renderAvatar}

      <Stack sx={{ flexGrow: 1 }}>
        {renderText}
        {notification.type === "friend" && <FriendAction />}
        {notification.type === "project" && <ProjectAction />}
        {notification.type === "file" && <FileAction />}
        {notification.type === "tags" && <TagsAction />}
        {notification.type === "payment" && <PaymentAction />}
      </Stack>
    </ListItemButton>
  );
}
