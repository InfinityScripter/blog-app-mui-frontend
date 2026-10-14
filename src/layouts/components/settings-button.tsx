"use client";

import Badge from "@mui/material/Badge";
import { useTranslations } from "next-intl";
import { Iconify } from "src/components/iconify";
import IconButton from "@mui/material/IconButton";
import { useSettingsContext } from "src/components/settings/context";

import type { SettingsButtonProps } from "./types";

// ----------------------------------------------------------------------

export function SettingsButton({ sx, ...other }: SettingsButtonProps) {
  const t = useTranslations("common");
  const settings = useSettingsContext();

  return (
    <IconButton
      aria-label={t("settings")}
      onClick={settings.onToggleDrawer}
      sx={{ p: 0, width: 40, height: 40, ...sx }}
      {...other}
    >
      <Badge color="error" variant="dot" invisible={!settings.canReset}>
        <Iconify icon="solar:settings-bold" width={22} />
      </Badge>
    </IconButton>
  );
}
