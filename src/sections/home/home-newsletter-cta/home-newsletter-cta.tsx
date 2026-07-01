import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";

import { NewsletterForm } from "./newsletter-form";
import { NL_TEXT, NL_TITLE, NL_LABEL } from "./const";

// ----------------------------------------------------------------------

// Email-capture block. Border/background/text come from the theme palette
// (alpha over primary) so it tracks primary-color and light/dark changes —
// no hardcoded colors per the sections guideline.
export function HomeNewsletterCta() {
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
          <Iconify icon="solar:letter-bold" width={20} />
          {NL_LABEL}
        </Box>

        <Typography variant="h3" sx={{ maxWidth: 600 }}>
          {NL_TITLE}
        </Typography>

        <Typography
          variant="body1"
          sx={{ maxWidth: 520, color: "text.secondary" }}
        >
          {NL_TEXT}
        </Typography>

        <NewsletterForm />
      </Stack>
    </Container>
  );
}
