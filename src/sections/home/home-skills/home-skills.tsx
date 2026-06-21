import type { Theme } from "@mui/material/styles";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { varFade, MotionViewport } from "src/components/animate";
import { SectionHeading } from "src/sections/home/components/section-heading";

import { SKILLS } from "./const";

// ----------------------------------------------------------------------

export function HomeSkills() {
  return (
    <Container component={MotionViewport} sx={{ py: { xs: 6, md: 10 } }}>
      <SectionHeading
        overline="Технологии"
        title="Навыки и стек"
        subtitle="Технологии, которыми я пользуюсь в продуктовой разработке"
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
        {SKILLS.map((skill) => (
          <m.div key={skill.name} variants={varFade().inUp}>
            <Stack
              spacing={2.5}
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
              <Stack direction="row" spacing={1.5} alignItems="center">
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
                  <Iconify icon={skill.icon} width={24} />
                </Box>
                <Typography variant="h6">{skill.name}</Typography>
              </Stack>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {skill.description}
              </Typography>

              <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
                {skill.items.map((item, index) => (
                  <Chip
                    key={item}
                    size="small"
                    variant="outlined"
                    label={item}
                    icon={<Iconify icon={skill.iconSkill[index]} width={16} />}
                    sx={{
                      fontWeight: 500,
                      "& .MuiChip-icon": { ml: 0.75 },
                    }}
                  />
                ))}
              </Stack>
            </Stack>
          </m.div>
        ))}
      </Box>
    </Container>
  );
}
