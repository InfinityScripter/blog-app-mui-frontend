"use client";

import Button from "@mui/material/Button";
import { useTranslations } from "next-intl";
import { Iconify } from "src/components/iconify";
import { RouterLink } from "src/routes/components";

import type { BackToSiteButtonProps } from "./types";

// ----------------------------------------------------------------------

// Escape hatch out of the auth flow. The logo already links home, but on a
// bare sign-in screen readers don't read it as a way back, so the auth header
// carries an explicit labelled link.
export function BackToSiteButton({ sx, ...other }: BackToSiteButtonProps) {
  const t = useTranslations("common");

  return (
    <Button
      component={RouterLink}
      href="/"
      color="inherit"
      size="small"
      startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={18} />}
      // Tracks the logo: on the auth screens both sit over the inverted ink
      // panel from `md` up, and over the plain page background below it.
      sx={{
        flexShrink: 0,
        whiteSpace: "nowrap",
        color: "var(--logo-foreground, inherit)",
        ...sx,
      }}
      {...other}
    >
      {t("backToSite")}
    </Button>
  );
}
