"use client";

import Button from "@mui/material/Button";
import { CONFIG } from "src/config-global";
import { useTranslations } from "next-intl";
import { RouterLink } from "src/routes/components";

import type { SignInButtonProps } from "./types";

// ----------------------------------------------------------------------

export function SignInButton({ sx, ...other }: SignInButtonProps) {
  const t = useTranslations("common");

  return (
    <Button
      component={RouterLink}
      href={CONFIG.auth.redirectPath}
      // Don't prefetch the heavy dashboard route from every public page header.
      prefetch={false}
      variant="outlined"
      // Keep «Sign in» / «Войти» on one line — never wrap to two.
      sx={{ flexShrink: 0, whiteSpace: "nowrap", ...sx }}
      {...other}
    >
      {t("signIn")}
    </Button>
  );
}
