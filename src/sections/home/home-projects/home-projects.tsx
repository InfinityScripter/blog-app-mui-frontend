import type { Theme } from "@mui/material/styles";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { alpha } from "@mui/material/styles";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";
import { varFade, MotionViewport } from "src/components/animate";
import { SectionHeading } from "src/sections/home/components/section-heading";

import { PROJECTS } from "./const";

// ----------------------------------------------------------------------

export function HomeProjects() {
  return (
    <Container component={MotionViewport} sx={{ py: { xs: 6, md: 10 } }}>
      <SectionHeading
        overline="Работы"
        title="Проекты"
        subtitle="Несколько недавних pet-проектов и продуктов"
      />

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            md: "repeat(3, 1fr)",
          },
        }}
      >
        {PROJECTS.map((project) => (
          <m.div key={project.title} variants={varFade().inUp}>
            <Stack
              sx={(theme: Theme) => ({
                p: 3,
                height: 1,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
                transition: theme.transitions.create(
                  ["border-color", "transform"],
                  { duration: theme.transitions.duration.shorter },
                ),
                "@media (hover: hover) and (pointer: fine)": {
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: alpha(theme.palette.primary.main, 0.4),
                  },
                },
              })}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2 }}
              >
                <Box
                  sx={(theme: Theme) => ({
                    width: 44,
                    height: 44,
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
              </Stack>

              <Stack spacing={2} sx={{ flexGrow: 1 }}>
                <Link
                  component={RouterLink}
                  href={project.link}
                  target="_blank"
                  rel="noopener"
                  sx={{ color: "inherit", textDecoration: "none" }}
                >
                  <Typography variant="h6">{project.title}</Typography>
                </Link>

                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {project.description}
                </Typography>

                <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
                  {project.tech.map((tech) => (
                    <Chip
                      key={tech}
                      size="small"
                      variant="outlined"
                      label={tech}
                      sx={{ fontWeight: 500 }}
                    />
                  ))}
                </Stack>

                <Stack spacing={1} sx={{ pt: 0.5 }}>
                  {project.features.map((feature) => (
                    <Stack
                      key={feature}
                      spacing={1}
                      direction="row"
                      alignItems="center"
                      sx={{ typography: "body2", color: "text.secondary" }}
                    >
                      <Iconify
                        icon="eva:checkmark-fill"
                        width={16}
                        sx={{ color: "primary.main", flexShrink: 0 }}
                      />
                      {feature}
                    </Stack>
                  ))}
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1.5} sx={{ pt: 3 }}>
                <Button
                  component={Link}
                  href={project.link}
                  target="_blank"
                  rel="noopener"
                  size="small"
                  color="inherit"
                  variant="outlined"
                  startIcon={<Iconify icon="eva:github-fill" />}
                  sx={{ flex: 1 }}
                >
                  Код
                </Button>

                <Button
                  component={Link}
                  href={project.demoLink || project.link}
                  target="_blank"
                  rel="noopener"
                  size="small"
                  variant="contained"
                  color="primary"
                  startIcon={<Iconify icon="eva:external-link-fill" />}
                  sx={{ flex: 1 }}
                >
                  Демо
                </Button>
              </Stack>
            </Stack>
          </m.div>
        ))}
      </Box>
    </Container>
  );
}
