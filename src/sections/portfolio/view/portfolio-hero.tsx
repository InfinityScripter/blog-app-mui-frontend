"use client";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { varFade, MotionContainer } from "src/components/animate";
import { MarketingGradientHighlight } from "src/components/marketing";
import {
  marketingHeroLeadSx,
  marketingStatPaperSx,
  marketingHeroCtaRowSx,
  marketingHeroTintBandSx,
} from "src/theme/styles";

import {
  CV_URL,
  GITHUB_URL,
  CV_DOWNLOAD_NAME,
  PORTFOLIO_METRICS,
} from "./const";

// ----------------------------------------------------------------------

export const PortfolioHero = () => (
  <Box sx={(theme) => marketingHeroTintBandSx(theme)}>
    <Container component={MotionContainer}>
      <Stack spacing={4} alignItems="center">
        <m.div variants={varFade().inDown}>
          <Typography variant="h1" align="center">
            Software{" "}
            <MarketingGradientHighlight>Engineer</MarketingGradientHighlight>
          </Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={marketingHeroLeadSx}
          >
            Михаил Талалаев · Frontend / Web — React, Next.js, TypeScript. 13+
            лет в IT: проектирую и поставляю продукты в прод от архитектуры до
            релиза.
          </Typography>
        </m.div>

        <Box sx={marketingHeroCtaRowSx}>
          <m.div variants={varFade({ distance: 24 }).inUp}>
            <Button
              component="a"
              href={CV_URL}
              download={CV_DOWNLOAD_NAME}
              color="primary"
              size="large"
              variant="contained"
              startIcon={
                <Iconify width={24} icon="solar:download-minimalistic-bold" />
              }
            >
              Скачать резюме
            </Button>
          </m.div>
          <m.div variants={varFade({ distance: 24 }).inUp}>
            <Button
              component={Link}
              href={GITHUB_URL}
              target="_blank"
              rel="noopener"
              color="primary"
              size="large"
              variant="outlined"
              startIcon={<Iconify width={24} icon="akar-icons:github-fill" />}
            >
              GitHub
            </Button>
          </m.div>
        </Box>

        <Grid container spacing={2} sx={{ width: 1, mt: 0 }}>
          {PORTFOLIO_METRICS.map((metric) => (
            <Grid key={metric.label} size={{ xs: 12, sm: 4 }}>
              <m.div variants={varFade().inUp}>
                <Paper variant="outlined" sx={marketingStatPaperSx}>
                  <Stack spacing={1} alignItems="center">
                    <Iconify
                      icon={metric.icon}
                      width={26}
                      sx={{ color: "primary.main" }}
                    />
                    <Typography variant="h6">{metric.value}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metric.label}
                    </Typography>
                  </Stack>
                </Paper>
              </m.div>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  </Box>
);
