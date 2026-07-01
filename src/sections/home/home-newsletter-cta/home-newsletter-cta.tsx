import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";

import { NewsletterForm } from "./newsletter-form";
import { NL_TEXT, NL_NOTE, NL_TITLE, NL_LABEL } from "./const";

// ----------------------------------------------------------------------

// Email-capture block. A dark branded panel (primary glow over a graphite
// gradient) with copy on the left and the form on the right — deliberately
// contrasted with the light outlined Telegram CTA below so the two don't read
// as duplicate boxes. All colors come from the theme palette (primary + grey)
// so it tracks the brand color; the surface stays dark in both light/dark mode.
export function HomeNewsletterCta() {
  return (
    <Container component="section" sx={{ py: { xs: 5, md: 8 } }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          p: { xs: 3.5, md: 6 },
          color: "common.white",
          backgroundImage: (theme) =>
            `radial-gradient(90% 130% at 0% 0%, ${alpha(
              theme.palette.primary.main,
              0.55,
            )} 0%, ${alpha(theme.palette.primary.main, 0)} 52%), ` +
            `linear-gradient(120deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 100%)`,
        }}
      >
        <Stack
          spacing={{ xs: 3, md: 5 }}
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          <Stack spacing={1.5} sx={{ maxWidth: 460 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                typography: "overline",
                color: "primary.light",
              }}
            >
              <Iconify icon="solar:letter-opened-bold" width={18} />
              {NL_LABEL}
            </Box>

            <Typography variant="h3" sx={{ lineHeight: 1.25 }}>
              {NL_TITLE}
            </Typography>

            <Typography variant="body2" sx={{ color: alpha("#FFFFFF", 0.72) }}>
              {NL_TEXT}
            </Typography>
          </Stack>

          <Box sx={{ width: 1, maxWidth: { xs: 1, md: 380 } }}>
            <NewsletterForm tone="dark" />
            <Typography
              variant="caption"
              sx={{ mt: 1.5, display: "block", color: alpha("#FFFFFF", 0.5) }}
            >
              {NL_NOTE}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}
