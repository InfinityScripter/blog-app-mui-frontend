import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import { alpha } from "@mui/material/styles";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { monoLabelSx, monoValueSx } from "src/theme/styles";

import { NewsletterForm } from "./newsletter-form";

// ----------------------------------------------------------------------

// Email-capture block. Editorial Ink: сплошная чернильная плита (grey.900 в
// обеих схемах) без градиентов; копия слева, форма справа, mono-примечание.
export function HomeNewsletterCta() {
  const t = useTranslations("home");

  return (
    <Container component="section" sx={{ py: { xs: 5, md: 8 } }}>
      <Box
        sx={{
          borderRadius: 2.5,
          p: { xs: 3.5, md: 6 },
          color: "common.white",
          bgcolor: "grey.900",
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
                ...monoLabelSx,
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                color: "primary.light",
              }}
            >
              <Iconify icon="solar:letter-opened-bold" width={18} />
              {t("newsletter.label")}
            </Box>

            <Typography variant="h2" component="h3" sx={{ lineHeight: 1.15 }}>
              {t("newsletter.title")}
            </Typography>

            <Typography variant="body2" sx={{ color: alpha("#FFFFFF", 0.72) }}>
              {t("newsletter.text")}
            </Typography>
          </Stack>

          <Box sx={{ width: 1, maxWidth: { xs: 1, md: 380 } }}>
            <NewsletterForm tone="dark" />
            <Typography
              component="p"
              sx={{
                ...monoValueSx,
                fontSize: 11,
                mt: 1.5,
                color: alpha("#FFFFFF", 0.5),
              }}
            >
              {t("newsletter.note")}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}
