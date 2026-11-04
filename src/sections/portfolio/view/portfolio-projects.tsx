import type { Theme } from "@mui/material/styles";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import { alpha } from "@mui/material/styles";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { varFade, MotionViewport } from "src/components/animate";
import { SectionHeading } from "src/sections/home/components/section-heading";

import { PORTFOLIO_PROJECTS } from "./const";

// ----------------------------------------------------------------------

export function PortfolioProjects() {
  const t = useTranslations("portfolio.projects");

  return (
    <Container component={MotionViewport} sx={{ py: { xs: 6, md: 10 } }}>
      <SectionHeading
        overline={t("overline")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "repeat(1, 1fr)", md: "repeat(2, 1fr)" },
        }}
      >
        {PORTFOLIO_PROJECTS.map((project) => (
          <m.div key={project.key} variants={varFade().inUp}>
            <Link
              href={project.link}
              target="_blank"
              rel="noopener"
              underline="none"
              color="inherit"
              aria-label={`${t("open")}: ${project.name}`}
              sx={{ display: "block", height: 1 }}
            >
              <Stack
                spacing={2}
                sx={(theme: Theme) => ({
                  p: 3,
                  height: 1,
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
                  transition: theme.transitions.create(["border-color"], {
                    duration: theme.transitions.duration.shorter,
                  }),
                  "@media (hover: hover) and (pointer: fine)": {
                    "&:hover": {
                      borderColor: alpha(theme.palette.primary.main, 0.4),
                    },
                  },
                })}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: "center" }}
                >
                  <Box
                    sx={(theme: Theme) => ({
                      width: 44,
                      height: 44,
                      flexShrink: 0,
                      borderRadius: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "primary.main",
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    })}
                  >
                    <Iconify icon={project.icon} width={24} />
                  </Box>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {project.name}
                  </Typography>
                  <Chip
                    size="small"
                    variant="soft"
                    color="primary"
                    label={t(`items.${project.key}.status`)}
                  />
                </Stack>

                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {t(`items.${project.key}.description`)}
                </Typography>

                <Typography variant="caption" sx={{ color: "text.disabled" }}>
                  {project.stack}
                </Typography>
              </Stack>
            </Link>
          </m.div>
        ))}
      </Box>
    </Container>
  );
}
