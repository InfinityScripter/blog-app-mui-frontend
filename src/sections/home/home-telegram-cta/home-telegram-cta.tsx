import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { alpha } from "@mui/material/styles";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";

import {
  CTA_TEXT,
  CTA_TITLE,
  CTA_LABEL,
  CTA_BUTTON,
  TELEGRAM_URL,
} from "./const";

// ----------------------------------------------------------------------

// Bottom-of-page subscription block. Border/background/text all come from the
// theme palette (alpha over primary) so it tracks primary-color and light/dark
// changes — no hardcoded colors per the sections guideline.
export function HomeTelegramCta() {
  return (
    <Container component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Stack
        spacing={3}
        alignItems="center"
        sx={{
          p: { xs: 4, md: 6 },
          borderRadius: 3,
          textAlign: "center",
          border: (theme) =>
            `solid 1px ${alpha(theme.palette.primary.main, 0.24)}`,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            typography: "overline",
            color: "primary.main",
          }}
        >
          <Iconify icon="mingcute:telegram-fill" width={20} />
          {CTA_LABEL}
        </Box>

        <Typography variant="h3" sx={{ maxWidth: 600 }}>
          {CTA_TITLE}
        </Typography>

        <Typography
          variant="body1"
          sx={{ maxWidth: 520, color: "text.secondary" }}
        >
          {CTA_TEXT}
        </Typography>

        <Button
          component={Link}
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener"
          size="large"
          variant="contained"
          startIcon={<Iconify icon="mingcute:telegram-fill" width={24} />}
        >
          {CTA_BUTTON}
        </Button>
      </Stack>
    </Container>
  );
}
