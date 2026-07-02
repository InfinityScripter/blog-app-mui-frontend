import type { Theme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { hairline } from "src/theme/styles";
import Typography from "@mui/material/Typography";
import { NewsletterForm } from "src/sections/home/home-newsletter-cta";

// ----------------------------------------------------------------------

// Slim post-footer email capture — reuses the shared NewsletterForm from the
// home newsletter section (same subscribe action + toast). No big heading,
// just a one-line pitch above the inline form. Palette-driven like the home CTA.
export function PostNewsletterCta() {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      sx={{
        mt: 5,
        p: { xs: 3, md: 4 },
        borderRadius: 2,
        textAlign: "center",
        border: (theme: Theme) => hairline(theme),
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h6" sx={{ maxWidth: 480 }}>
        Понравился разбор? Получайте такие раз в неделю на почту
      </Typography>

      <Box sx={{ width: 1, maxWidth: 480 }}>
        <NewsletterForm />
      </Box>
    </Stack>
  );
}
