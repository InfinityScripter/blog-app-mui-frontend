import { m } from "framer-motion";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { RouterLink } from "src/routes/components";

import { Iconify } from "src/components/iconify";
import { varFade, MotionViewport } from "src/components/animate";

// ----------------------------------------------------------------------

const PROJECTS = [
  {
    title: "Блог-платформа",
    description:
      "Полнофункциональная блог-платформа с компонентами Material UI, аутентификацией пользователей и адаптивным дизайном.",
    icon: "mdi:blog",
    iconColor: "primary.main",
    link: "https://github.com/InfinityScripter/blog-app-mui-frontend",
    demoLink: "https://sh0ny.ru/post",
    tech: ["React", "Material UI", "Node.js"],
    features: [
      "Аутентификация пользователей",
      "Адаптивный дизайн",
      "Управление постами",
      "Компоненты Material UI",
    ],
  },
  {
    title: "Погодное приложение",
    description:
      "Интерактивное погодное приложение с данными о погоде в реальном времени, прогнозами и поиском по местоположению.",
    icon: "mdi:weather-partly-cloudy",
    iconColor: "primary.main",
    link: "https://github.com/InfinityScripter/weather-app",
    demoLink: "https://weather-app-blue-nine-95.vercel.app/",
    tech: ["React", "Weather API", "CSS"],
    features: [
      "Данные о погоде в реальном времени",
      "Поиск по местоположению",
      "Визуализация прогноза",
      "Адаптивный дизайн",
    ],
  },
  {
    title: "Панель управления Next.js",
    description:
      "Современная панель администратора, созданная с использованием Next.js, с аналитикой, управлением пользователями и визуализацией данных.",
    icon: "mdi:chart-box",
    iconColor: "primary.main",
    link: "https://github.com/InfinityScripter/dashboard-next-js",
    demoLink: "https://dashboard-plum-zeta-47.vercel.app/",
    tech: ["Next.js", "Material UI", "Chart.js"],
    features: [
      "Визуализация данных",
      "Управление пользователями",
      "Аналитическая панель",
      "Темная/Светлая тема",
    ],
  },
];

export function HomeProjects() {
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
          <Typography variant="h2">Проекты</Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography sx={{ color: "text.secondary" }}>
            Некоторые из моих недавних проектов
          </Typography>
        </m.div>
      </Stack>

      <Box
        gap={4}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          md: "repeat(3, 1fr)",
        }}
      >
        {PROJECTS.map((project) => (
          <m.div key={project.title} variants={varFade().inUp}>
            <Card
              sx={{
                textAlign: "left",
                p: 3,
                height: 1,
                display: "flex",
                flexDirection: "column", // Добавляем flex-направление как колонку
              }}
            >
              {/* Иконка проекта */}
              {project.icon && (
                <Box
                  sx={{
                    mb: 3,
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    height: 24,
                  }}
                >
                  <Iconify
                    icon={project.icon}
                    width={24}
                    height={24}
                    sx={{
                      color: project.iconColor || "primary.main",
                    }}
                  />
                </Box>
              )}

              {/* Основное содержимое */}
              <Stack spacing={2} sx={{ flexGrow: 1 }}>
                {" "}
                {/* Добавляем flexGrow: 1, чтобы этот компонент занимал все доступное пространство */}
                <Link
                  component={RouterLink}
                  href={project.link}
                  target="_blank"
                  sx={{ color: "inherit", textDecoration: "none" }}
                >
                  <Typography variant="h5" noWrap>
                    {project.title}
                  </Typography>
                </Link>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {project.description}
                </Typography>
                <Stack direction="row" flexWrap="wrap" spacing={1}>
                  {project.tech.map((tech) => (
                    <Typography
                      key={tech}
                      variant="caption"
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: "action.selected",
                      }}
                    >
                      {tech}
                    </Typography>
                  ))}
                </Stack>
                <Stack spacing={1} sx={{ pt: 1 }}>
                  {project.features.map((feature) => (
                    <Stack
                      key={feature}
                      spacing={1}
                      direction="row"
                      alignItems="center"
                      sx={{ typography: "body2" }}
                    >
                      <Iconify
                        icon="eva:checkmark-fill"
                        width={16}
                        sx={{ color: "primary.main" }}
                      />
                      {feature}
                    </Stack>
                  ))}
                </Stack>
              </Stack>

              {/* Кнопки внизу */}
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  pt: 2,
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                <Button
                  component={Link}
                  href={project.link}
                  target="_blank"
                  rel="noopener"
                  size="small"
                  color="inherit"
                  variant="contained"
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
            </Card>
          </m.div>
        ))}
      </Box>
    </Container>
  );
}
