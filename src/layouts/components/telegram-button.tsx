import type { IconButtonProps } from "@mui/material/IconButton";

import Link from "@mui/material/Link";
import { CONFIG } from "src/config-global";
import { useTranslations } from "next-intl";
import { Iconify } from "src/components/iconify";
import IconButton from "@mui/material/IconButton";

// ----------------------------------------------------------------------

// Persistent header affordance to subscribe to the Telegram channel — visible on
// every page next to search/settings. Links out to CONFIG.social.telegramChannel.
export function TelegramButton({ sx, ...other }: IconButtonProps) {
  const t = useTranslations("home");

  return (
    <IconButton
      component={Link}
      href={CONFIG.social.telegramChannel}
      target="_blank"
      rel="noopener"
      aria-label={t("telegram.button")}
      sx={{ p: 0, width: 40, height: 40, ...sx }}
      {...other}
    >
      <Iconify icon="mingcute:telegram-fill" width={24} />
    </IconButton>
  );
}
