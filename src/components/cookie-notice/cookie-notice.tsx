"use client";

import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import { paths } from "src/routes/paths";
import Button from "@mui/material/Button";
import { useTranslations } from "next-intl";
import { hairline } from "src/theme/styles";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";

import { useCookieNotice } from "./hooks/use-cookie-notice";

// ----------------------------------------------------------------------

export function CookieNotice() {
  const t = useTranslations("cookieNotice");
  const { open, dismiss } = useCookieNotice();

  if (!open) {
    return null;
  }

  return (
    <Paper
      component="aside"
      elevation={8}
      sx={{
        p: 2,
        gap: 1.5,
        display: "flex",
        maxWidth: 460,
        borderRadius: 2,
        position: "fixed",
        alignItems: "center",
        left: { xs: 12, md: 24 },
        bottom: { xs: 12, md: 24 },
        // xs: leave the bottom-right corner free — BackToTop (48px FAB at
        // right 24) must stay visible and clickable while the notice is open.
        right: { xs: 84, md: "auto" },
        border: (theme) => hairline(theme),
        zIndex: (theme) => theme.zIndex.appBar - 1,
      }}
    >
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {t("message")}{" "}
        <Link
          component={RouterLink}
          href={paths.legal.privacyPolicy}
          underline="always"
        >
          {t("more")}
        </Link>
      </Typography>
      <Button
        size="small"
        variant="contained"
        onClick={dismiss}
        sx={{ flexShrink: 0 }}
      >
        {t("dismiss")}
      </Button>
    </Paper>
  );
}
