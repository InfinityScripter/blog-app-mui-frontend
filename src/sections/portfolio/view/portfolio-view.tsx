"use client";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { textGradient } from "src/theme/styles";
import { useTheme } from "@mui/material/styles";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { varFade, MotionContainer } from "src/components/animate";
import { HomeExperience } from "src/sections/home/home-experience";
import { PORTFOLIO_METRICS } from "src/sections/portfolio/view/const";
import {
  portfolioMetricCardSx,
  portfolioHeroSectionSx,
} from "src/sections/portfolio/view/utils";

export function PortfolioView() {
  const theme = useTheme();

  return (
    <>
      <Box sx={portfolioHeroSectionSx(theme)}>
        <Container component={MotionContainer}>
          <Stack spacing={4} sx={{ textAlign: "center" }}>
            <m.div variants={varFade().inDown}>
              <Typography variant="overline" sx={{ color: "primary.main" }}>
                PORTFOLIO
              </Typography>
            </m.div>

            <m.div variants={varFade().inDown}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: 38, md: 56 },
                }}
              >
                Портфолио и{" "}
                <Box
                  component="span"
                  sx={{
                    ...textGradient(
                      `300deg, ${theme.vars?.palette.primary.main || theme.palette.primary.main} 0%, ${theme.vars?.palette.warning.main || theme.palette.warning.main} 25%, ${theme.vars?.palette.primary.main || theme.palette.primary.main} 50%, ${theme.vars?.palette.warning.main || theme.palette.warning.main} 75%, ${theme.vars?.palette.primary.main || theme.palette.primary.main} 100%`,
                    ),
                    backgroundSize: "400%",
                  }}
                >
                  практический опыт
                </Box>
              </Typography>
            </m.div>

            <m.div variants={varFade().inDown}>
              <Typography
                sx={{
                  mx: "auto",
                  maxWidth: 760,
                  color: "text.secondary",
                  typography: { xs: "body1", md: "h6" },
                }}
              >
                Отдельная страница с практическим опытом, проектами и
                технологическим стеком. Главная теперь сфокусирована на блоге.
              </Typography>
            </m.div>

            <m.div variants={varFade().inUp}>
              <Stack
                spacing={2}
                direction={{ xs: "column", sm: "row" }}
                justifyContent="center"
              >
                <Button
                  component={Link}
                  href="/post"
                  variant="contained"
                  size="large"
                  startIcon={
                    <Iconify
                      icon="solar:document-text-bold-duotone"
                      width={22}
                    />
                  }
                >
                  Перейти к статьям
                </Button>

                <Button
                  component={Link}
                  href="https://github.com/InfinityScripter"
                  target="_blank"
                  rel="noopener"
                  variant="outlined"
                  size="large"
                  startIcon={
                    <Iconify icon="akar-icons:github-fill" width={22} />
                  }
                >
                  GitHub
                </Button>
              </Stack>
            </m.div>

            <Box
              sx={{
                mt: 2,
                gap: 2,
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              }}
            >
              {PORTFOLIO_METRICS.map((metric) => (
                <m.div key={metric.label} variants={varFade().inUp}>
                  <Box sx={portfolioMetricCardSx(theme)}>
                    <Stack spacing={1} alignItems="center">
                      <Iconify
                        icon={metric.icon}
                        width={26}
                        sx={{ color: "primary.main" }}
                      />
                      <Typography variant="h6" color="text.primary">
                        {metric.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {metric.label}
                      </Typography>
                    </Stack>
                  </Box>
                </m.div>
              ))}
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* <HomeAbout /> */}
      {/* <HomeSkills /> */}
      <HomeExperience />
      {/* <HomeProjects /> */}
    </>
  );
}
