"use client";

import type { Theme } from "@mui/material/styles";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { varFade, MotionContainer } from "src/components/animate";
import { MarketingGradientHighlight } from "src/components/marketing";
import { hairline, monoLabelSx, monoValueSx } from "src/theme/styles";

import {
  CV_URL,
  GITHUB_URL,
  CV_DOWNLOAD_NAME,
  PORTFOLIO_METRICS,
} from "./const";

// ----------------------------------------------------------------------

// Editorial Ink: асимметричный сплит 7/5 — текст слева, факт-лист справа.
// Вместо градиентной плашки — бумага, hairline-рамка и один vermilion-акцент.
export const PortfolioHero = () => (
  <Box sx={{ borderBottom: (theme: Theme) => hairline(theme) }}>
    <Container
      component={MotionContainer}
      sx={{ py: { xs: 8, md: "clamp(4rem, 8vw, 6rem)" } }}
    >
      <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={4} alignItems="flex-start">
            <m.div variants={varFade().inDown}>
              <Typography component="p" sx={{ ...monoLabelSx, mb: 2 }}>
                Михаил Талалаев · 13+ лет в IT
              </Typography>

              <Typography variant="h1">
                Software
                <MarketingGradientHighlight>
                  Engineer
                </MarketingGradientHighlight>
              </Typography>
            </m.div>

            <m.div variants={varFade().inDown}>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  maxWidth: "65ch",
                  fontSize: { xs: 16, md: 18 },
                  lineHeight: 1.7,
                }}
              >
                Проектирую и поставляю продукты в прод — от архитектуры до
                релиза. Сильная сторона — фронтенд: React, Next.js, TypeScript.
              </Typography>
            </m.div>

            <m.div variants={varFade({ distance: 24 }).inUp}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: { xs: 1.5, sm: 2 },
                }}
              >
                <Button
                  component="a"
                  href={CV_URL}
                  download={CV_DOWNLOAD_NAME}
                  color="primary"
                  size="large"
                  variant="contained"
                  startIcon={
                    <Iconify
                      width={22}
                      icon="solar:download-minimalistic-bold"
                    />
                  }
                >
                  Скачать резюме
                </Button>

                <Button
                  component={Link}
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener"
                  color="inherit"
                  size="large"
                  variant="outlined"
                  startIcon={
                    <Iconify width={22} icon="akar-icons:github-fill" />
                  }
                >
                  GitHub
                </Button>
              </Box>
            </m.div>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Stack>
            {PORTFOLIO_METRICS.map((metric) => (
              <m.div key={metric.label} variants={varFade().inUp}>
                <Stack
                  spacing={0.5}
                  sx={{
                    py: 2.5,
                    borderTop: (theme: Theme) => hairline(theme),
                  }}
                >
                  <Typography
                    component="p"
                    sx={{ ...monoLabelSx, fontSize: 11 }}
                  >
                    {metric.label}
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Iconify
                      icon={metric.icon}
                      width={22}
                      sx={{ color: "primary.main" }}
                    />
                    <Typography
                      component="p"
                      sx={{ ...monoValueSx, fontSize: 18 }}
                    >
                      {metric.value}
                    </Typography>
                  </Stack>
                </Stack>
              </m.div>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  </Box>
);
