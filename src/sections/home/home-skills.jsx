import { m } from "framer-motion";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";
import { varFade, MotionViewport } from "src/components/animate";

// ----------------------------------------------------------------------

const SKILLS = [
  {
    name: "Frontend Разработка",
    description: "Создание современных и адаптивных веб-интерфейсов",
    icon: "mdi:react",
    items: [
      "React",
      "TypeScript",
      "Next.js",
      "Angular",
      "Material UI",
      "Redux",
      "Tailwind CSS",
    ],
    iconSkill: [
      "logos:react",
      "logos:typescript-icon",
      "logos:nextjs-icon",
      "logos:angular-icon",
      "logos:material-ui",
      "logos:redux",
      "logos:tailwindcss-icon",
    ],
  },
  {
    name: "Backend Разработка",
    description: "Серверная разработка и реализация API",
    icon: "mdi:database",
    items: [
      "Node.js",
      "REST API",
      "Symfony",
      "Docker",
      "Express",
      "MongoDB",
      "PostgreSQL",
      "Mariadb",
    ],
    iconSkill: [
      "logos:nodejs-icon",
      "logos:rest",
      "logos:symfony",
      "logos:docker",
      "logos:express",
      "logos:mongodb-icon",
      "logos:postgresql",
      "logos:mariadb",
    ],
  },
  {
    name: "Инструменты и DevOps",
    description: "Инструменты разработки и развертывания",
    icon: "mdi:tools",
    items: [
      "Git",
      "Webpack",
      "Figma",
      "Docker",
      "AWS",
      "CI/CD",
      "Jest",
      "Cypress",
    ],
    iconSkill: [
      "logos:git-icon",
      "logos:webpack",
      "logos:figma",
      "logos:docker",
      "logos:aws",
      "logos:jenkins",
      "logos:jest",
      "logos:cypress",
    ],
  },
];

export  function HomeSkills() {
  const theme = useTheme();

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 5, md: 10 },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          textAlign: "center",
          mb: { xs: 5, md: 10 },
        }}
      >
        <m.div variants={varFade().inDown}>
          <Typography variant="h2">Мои навыки</Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography sx={{ color: "text.secondary" }}>
            Профессиональные навыки и технологии, которые я использую в своей
            работе
          </Typography>
        </m.div>
      </Stack>

      <Box
        gap={4}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        }}
      >
        {SKILLS.map((skill) => (
          <m.div key={skill.name} variants={varFade().inUp}>
            <Paper
              sx={{
                p: 4,
                height: 1,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                bgcolor: theme.palette.background.neutral,
              }}
            >
              <Stack spacing={3} flexGrow={1}>
                <Iconify
                  icon={skill.icon}
                  width={32}
                  sx={{
                    color: "primary.main",
                  }}
                />

                <Typography variant="h5">{skill.name}</Typography>

                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {skill.description}
                </Typography>

                <Stack spacing={1} sx={{ pt: 3 }}>
                  {skill.items.map((item, index) => (
                    <Stack
                      key={item}
                      spacing={1}
                      direction="row"
                      alignItems="center"
                      sx={{
                        typography: "body2",
                      }}
                    >
                      <Iconify
                        icon={skill.iconSkill[index]}
                        width={20}
                        sx={{ color: "primary.main" }}
                      />
                      {item}
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Paper>
          </m.div>
        ))}
      </Box>
    </Container>
  );
}
