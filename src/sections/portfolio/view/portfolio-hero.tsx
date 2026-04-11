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

import { PORTFOLIO_METRICS } from "./const";

// ----------------------------------------------------------------------

export const PortfolioHero = () => (
  <Box sx={(theme) => marketingHeroTintBandSx(theme)}>
    <Container component={MotionContainer}>
      <Stack spacing={4} alignItems="center">
        <m.div variants={varFade().inDown}>
          <Typography variant="h1" align="center">
            Портфолио и{" "}
            <MarketingGradientHighlight>
              практический опыт
            </MarketingGradientHighlight>
          </Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={marketingHeroLeadSx}
          >
            Отдельная страница с практическим опытом, проектами и
            технологическим стеком. Главная теперь сфокусирована на блоге.
          </Typography>
        </m.div>

        <Box sx={marketingHeroCtaRowSx}>
          <m.div variants={varFade({ distance: 24 }).inUp}>
            <Button
              component={Link}
              href="/post"
              color="primary"
              size="large"
              variant="contained"
              startIcon={
                <Iconify width={24} icon="mdi:newspaper-variant-outline" />
              }
            >
              Перейти к статьям
            </Button>
          </m.div>
          <m.div variants={varFade({ distance: 24 }).inUp}>
            <Button
              component={Link}
              href="https://github.com/InfinityScripter"
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
