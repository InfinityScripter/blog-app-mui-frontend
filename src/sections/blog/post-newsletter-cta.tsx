import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
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
        border: (theme) =>
          `solid 1px ${alpha(theme.palette.primary.main, 0.24)}`,
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
      }}
    >
      <Typography variant="h6" sx={{ maxWidth: 480 }}>
        Понравился разбор? Получайте такие раз в неделю на почту
      </Typography>

      <NewsletterForm />
    </Stack>
  );
}
