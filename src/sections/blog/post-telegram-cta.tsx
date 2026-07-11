"use client";

import type { Theme } from "@mui/material/styles";

import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { CONFIG } from "src/config-global";
import { useTranslations } from "next-intl";
import { hairline } from "src/theme/styles";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

// Slim end-of-article Telegram CTA — the peak-intent spot to convert a reader
// into a channel subscriber. Sits beside the newsletter CTA so a finished post
// offers both owned channels (email + Telegram). Palette-driven, hairline card.
export function PostTelegramCta() {
  const t = useTranslations("blog");
  const tHome = useTranslations("home");

  return (
    <Stack
      spacing={2}
      alignItems="center"
      sx={{
        mt: 3,
        p: { xs: 3, md: 4 },
        borderRadius: 2,
        textAlign: "center",
        border: (theme: Theme) => hairline(theme),
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h6" sx={{ maxWidth: 480 }}>
        {t("telegramCta")}
      </Typography>

      <Button
        component={Link}
        href={CONFIG.social.telegramChannel}
        target="_blank"
        rel="noopener"
        size="large"
        variant="contained"
        startIcon={<Iconify icon="mingcute:telegram-fill" width={24} />}
      >
        {tHome("telegram.button")}
      </Button>
    </Stack>
  );
}
