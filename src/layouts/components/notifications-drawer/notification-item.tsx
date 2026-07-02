import type { MouseEvent } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { varAlpha } from "src/theme/styles";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import { hairline, monoLabelSx } from "src/theme/styles/editorial";

import { KIND_CONFIG } from "./const";
import { formatTimeAgo } from "./utils";

import type { NotificationItemProps } from "./types";

// ----------------------------------------------------------------------

const metaLineSx = { ...monoLabelSx, fontSize: 11, lineHeight: "18px" };

export function NotificationItem({
  notification,
  isUnread,
  isArchived,
  onOpen,
  onToggleArchive,
}: NotificationItemProps) {
  const config = KIND_CONFIG[notification.kind];

  const handleToggleArchive = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onToggleArchive(notification.id);
  };

  const renderThumb = notification.coverUrl ? (
    <Avatar
      variant="rounded"
      alt={notification.message}
      src={notification.coverUrl}
      sx={{ width: 44, height: 44, borderRadius: 1.5, flexShrink: 0 }}
    />
  ) : (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        width: 44,
        height: 44,
        flexShrink: 0,
        borderRadius: 1.5,
        color: `${config.color}.main`,
        bgcolor: (theme) =>
          varAlpha(theme.vars.palette[config.color].mainChannel, 0.08),
      }}
    >
      <Iconify icon={config.icon} width={22} />
    </Stack>
  );

  const renderMetaLine = (
    <Stack direction="row" alignItems="center" spacing={0.75}>
      {isUnread && (
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: `${config.color}.main`,
          }}
        />
      )}

      <Box component="span" sx={{ ...metaLineSx, color: `${config.color}.main` }}>
        {config.label}
      </Box>

      <Box
        component="span"
        sx={{ ...metaLineSx, color: "text.disabled", textTransform: "none" }}
      >
        · {formatTimeAgo(notification.createdAt)}
      </Box>
    </Stack>
  );

  return (
    <ListItemButton
      component="div"
      onClick={() => onOpen(notification)}
      sx={{
        gap: 1.5,
        px: 2.5,
        py: 2,
        alignItems: "flex-start",
        borderBottom: (theme) => hairline(theme),
        ...(isUnread && {
          bgcolor: (theme) =>
            varAlpha(theme.vars.palette[config.color].mainChannel, 0.04),
        }),
        "&:hover .notification-item-action": { opacity: 1 },
        "@media (hover: none)": {
          "& .notification-item-action": { opacity: 1 },
        },
      }}
    >
      {renderThumb}

      <Stack spacing={0.25} sx={{ flexGrow: 1, minWidth: 0, pr: 3 }}>
        {renderMetaLine}

        <Typography
          variant="subtitle2"
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {notification.message}
        </Typography>

        {!!notification.meta && (
          <Typography variant="caption" noWrap sx={{ color: "text.secondary" }}>
            {notification.meta}
          </Typography>
        )}
      </Stack>

      <Tooltip title={isArchived ? "Вернуть из архива" : "В архив"}>
        <IconButton
          size="small"
          onClick={handleToggleArchive}
          className="notification-item-action"
          aria-label={isArchived ? "Вернуть из архива" : "В архив"}
          sx={{
            top: 12,
            right: 12,
            opacity: 0,
            position: "absolute",
            color: "text.disabled",
            transition: (theme) =>
              theme.transitions.create(["opacity", "color"]),
            "&:hover": { color: "text.primary" },
          }}
        >
          <Iconify
            width={18}
            icon={
              isArchived
                ? "solar:undo-left-round-bold-duotone"
                : "solar:archive-minimalistic-bold-duotone"
            }
          />
        </IconButton>
      </Tooltip>
    </ListItemButton>
  );
}
