"use client";

import Box from "@mui/material/Box";
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
      className="ls-cookie"
      elevation={8}
      sx={{
        py: 1.25,
        pl: 1.5,
        pr: 1.25,
        gap: { xs: 1, sm: 1.5 },
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        maxWidth: { sm: 440 },
        borderRadius: 2,
        position: "fixed",
        alignItems: { xs: "stretch", sm: "center" },
        left: { xs: 12, md: 24 },
        right: { xs: 12, sm: "auto" },
        bottom: { xs: 12, md: 24 },
        border: (theme) => hairline(theme),
        zIndex: (theme) => theme.zIndex.appBar - 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <span className="ls-cookie__varya" aria-hidden />
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", lineHeight: 1.45 }}
        >
          {t("message")}{" "}
          <Link
            component={RouterLink}
            href={paths.legal.privacyPolicy}
            underline="always"
          >
            {t("more")}
          </Link>
        </Typography>
      </Box>
      <Button
        size="small"
        variant="contained"
        onClick={dismiss}
        sx={{ flexShrink: 0, alignSelf: { xs: "flex-end", sm: "auto" } }}
      >
        {t("dismiss")}
      </Button>
    </Paper>
  );
}
