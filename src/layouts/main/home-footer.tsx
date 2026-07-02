import type { Theme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { Logo } from "src/components/logo";
import { CONFIG } from "src/config-global";
import Container from "@mui/material/Container";
import { hairline, monoValueSx } from "src/theme/styles";

import type { HomeFooterProps } from "./types";

// ----------------------------------------------------------------------

export function HomeFooter({ sx }: HomeFooterProps) {
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
          © All rights reserved.
          <br /> сделано
          <Link href={CONFIG.social.telegram}> Mikhail Talalaev </Link>
        </Box>
      </Container>
    </Box>
  );
}
