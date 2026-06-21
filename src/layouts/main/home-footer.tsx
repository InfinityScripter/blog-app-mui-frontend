import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { Logo } from "src/components/logo";
import Container from "@mui/material/Container";

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
        ...sx,
      }}
    >
      <Container>
        <Logo />
        <Box sx={{ mt: 1, typography: "caption" }}>
          © All rights reserved.
          <br /> сделано
          <Link href="https://t.me/sh0ny/"> Mikhail Talalaev </Link>
        </Box>
      </Container>
    </Box>
  );
}
