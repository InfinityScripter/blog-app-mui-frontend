"use client";

import type { Theme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { Logo } from "src/components/logo";
import { CONFIG } from "src/config-global";
import { useTranslations } from "next-intl";
import Container from "@mui/material/Container";
import { hairline, monoValueSx } from "src/theme/styles";

import type { HomeFooterProps } from "./types";

// ----------------------------------------------------------------------

export function HomeFooter({ sx }: HomeFooterProps) {
  const t = useTranslations("footer");

  return (
    <Box
      component="footer"
      sx={{
        py: 5,
        textAlign: "center",
        position: "relative",
        bgcolor: "background.default",
        borderTop: (theme: Theme) => hairline(theme),
        ...sx,
      }}
    >
      <Container>
        <Logo />
        <Box sx={{ ...monoValueSx, fontSize: 11, mt: 1.5 }}>
          {t("rights")}
          <br /> {t("madeBy")}
          <Link href={CONFIG.social.telegram}> Mikhail Talalaev </Link>
        </Box>
      </Container>
    </Box>
  );
}
