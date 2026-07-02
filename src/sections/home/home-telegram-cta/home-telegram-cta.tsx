import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { hairline, monoLabelSx } from "src/theme/styles";

import {
  CTA_TEXT,
  CTA_TITLE,
  CTA_LABEL,
  CTA_BUTTON,
  TELEGRAM_URL,
} from "./const";

// ----------------------------------------------------------------------

// Bottom-of-page subscription block. Editorial Ink: компактная split-полоса
// на бумаге с hairline-рамкой — текст слева, кнопка справа; без заливок.
export function HomeTelegramCta() {
  return (
    <Container component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Stack
        spacing={{ xs: 3, md: 5 }}
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        sx={{
          p: { xs: 4, md: 5 },
          borderRadius: 2.5,
          bgcolor: "background.paper",
          border: (theme) => hairline(theme),
        }}
      >
        <Stack spacing={1.5} sx={{ maxWidth: 560 }}>
          <Box
            sx={{
              ...monoLabelSx,
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              color: "primary.main",
            }}
          >
            <Iconify icon="mingcute:telegram-fill" width={18} />
            {CTA_LABEL}
          </Box>

          <Typography variant="h3">{CTA_TITLE}</Typography>

          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {CTA_TEXT}
          </Typography>
        </Stack>

        <Button
          component={Link}
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener"
          size="large"
          variant="contained"
          sx={{ flexShrink: 0 }}
          startIcon={<Iconify icon="mingcute:telegram-fill" width={24} />}
        >
          {CTA_BUTTON}
        </Button>
      </Stack>
    </Container>
  );
}
