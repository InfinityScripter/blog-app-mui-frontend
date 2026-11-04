import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useTranslations } from "next-intl";
import { monoLabelSx } from "src/theme/styles";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";

import {
  PEEK_SRC,
  TELEGRAM_URL,
  PEEK_VARIANTS,
  MARQUEE_REPEATS,
} from "./const";

// ----------------------------------------------------------------------

export function HomeTelegramCta() {
  const t = useTranslations("home");
  const marquee: string[] = t.raw("telegram.marquee");

  return (
    <Box
      component={m.section}
      initial="hidden"
      whileInView="shown"
      whileHover="hover"
      viewport={{ once: true, amount: 0.3 }}
      className="ls-tg"
    >
      <div className="ls-giant" aria-hidden>
        <div className="ls-track">
          {Array.from({ length: MARQUEE_REPEATS }, () => marquee)
            .flat()
            .map((word, index) => (
              <span key={index}>{word}</span>
            ))}
        </div>
      </div>

      <Box
        component={m.img}
        variants={PEEK_VARIANTS}
        className="ls-tg__peek"
        src={PEEK_SRC}
        alt={t("telegram.peekAlt")}
        width={560}
        height={560}
        loading="lazy"
      />

      <Container className="ls-tg__body">
        <Stack spacing={2} sx={{ maxWidth: 760 }}>
          <Box
            sx={{
              ...monoLabelSx,
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
            }}
          >
            <Iconify icon="mingcute:telegram-fill" width={18} />
            {t("telegram.label")}
          </Box>
          <Typography component="h2" className="ls-display-xl">
            {t("telegram.title")}
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            {t("telegram.text")}
          </Typography>
          <Button
            component={Link}
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener"
            size="large"
            color="primary"
            variant="contained"
            className="ls-sticker-btn"
            sx={{ alignSelf: "flex-start" }}
            startIcon={<Iconify icon="mingcute:telegram-fill" width={24} />}
          >
            {t("telegram.button")}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
