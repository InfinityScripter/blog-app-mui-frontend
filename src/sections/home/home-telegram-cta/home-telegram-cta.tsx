import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useTranslations } from "next-intl";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";
import { hairline, monoLabelSx } from "src/theme/styles";

import { TELEGRAM_URL, HOME_SECTION_LINKS } from "./const";

// ----------------------------------------------------------------------

export function HomeTelegramCta() {
  const t = useTranslations("home");

  return (
    <Container component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Stack spacing={3}>
        <Stack
          spacing={{ xs: 3, md: 5 }}
          direction={{ xs: "column", md: "row" }}
          sx={{
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
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
              {t("telegram.label")}
            </Box>

            <Typography variant="h3">{t("telegram.title")}</Typography>

            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              {t("telegram.text")}
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
            {t("telegram.button")}
          </Button>
        </Stack>

        <Stack
          direction="row"
          spacing={3}
          useFlexGap
          sx={{ flexWrap: "wrap", alignItems: "baseline" }}
        >
          <Typography component="span" sx={monoLabelSx}>
            {t("links.title")}
          </Typography>
          {HOME_SECTION_LINKS.map((item) => (
            <Link
              key={item.key}
              component={RouterLink}
              href={item.href}
              variant="subtitle2"
            >
              {t(`links.${item.key}`)}
            </Link>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
