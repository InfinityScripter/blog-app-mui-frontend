"use client";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { textGradient } from "src/theme/styles";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { varFade, MotionContainer } from "src/components/animate";
import { HomeExperience } from "src/sections/home/home-experience";

const PORTFOLIO_METRICS = [
  {
    icon: "solar:code-bold-duotone",
    label: "Продуктовый фокус",
    value: "UI + DX",
  },
  {
    icon: "solar:cpu-bolt-bold-duotone",
    label: "Основной стек",
    value: "React / Next.js",
  },
  {
    icon: "solar:clock-circle-bold-duotone",
    label: "Опыт в IT",
    value: "13+ лет",
  },
];

export function PortfolioView() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <>
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          background:
            theme.palette.mode === "dark"
              ? `linear-gradient(135deg, ${alpha("#2065D1", 0.16)} 0%, ${alpha("#00A76F", 0.08)} 100%)`
              : `linear-gradient(135deg, ${alpha("#2065D1", 0.08)} 0%, ${alpha("#00A76F", 0.04)} 100%)`,
        }}
      >
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
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: isDarkMode
                        ? alpha(theme.palette.grey[900], 0.84)
                        : alpha(theme.palette.background.paper, 0.82),
                      border: `1px solid ${alpha(theme.palette.divider, isDarkMode ? 0.45 : 0.22)}`,
                      boxShadow: isDarkMode
                        ? `0 8px 24px ${alpha(theme.palette.common.black, 0.34)}`
                        : `0 8px 24px ${alpha(theme.palette.grey[500], 0.14)}`,
                    }}
                  >
                    <Stack spacing={1} alignItems="center">
                      <Iconify
                        icon={metric.icon}
                        width={26}
                        sx={{
                          color: isDarkMode ? "warning.light" : "primary.main",
                        }}
                      />
                      <Typography variant="h6">{metric.value}</Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isDarkMode ? "grey.200" : "text.secondary",
                        }}
                      >
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
