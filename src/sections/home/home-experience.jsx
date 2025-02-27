import { m } from "framer-motion";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Timeline from "@mui/lab/Timeline";
import TimelineDot from "@mui/lab/TimelineDot";
import Container from "@mui/material/Container";
import TimelineItem from "@mui/lab/TimelineItem";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import Avatar from "@mui/material/Avatar";

import { MotionViewport, varFade } from "src/components/animate";
import Link from "@mui/material/Link";

// ----------------------------------------------------------------------

const EXPERIENCE = [
  {
    position: "IT Systems Implementation Specialist",
    company: "Газпром",
    location: "Санкт-Петербург",
    period: "Март 2016 — Сентябрь 2022",
    description: [
      "Внедрение и настройка корпоративных IT-систем",
      "Интеграция систем документооборота",
      "Обучение персонала работе с новыми IT-решениями",
      "Оптимизация бизнес-процессов с использованием IT-инструментов",
    ],
    technologies:
      "SAP, 1C, Microsoft SharePoint, SQL, Business Intelligence tools",
    logo: "/assets/icons/experience/gazprom.svg",
    link: "https://pererabotka.gazprom.ru",
  },
  {
    position: "Frontend Developer (React, TS)",
    company: "QCup",
    location: "Санкт-Петербург",
    period: "Ноябрь 2022 — Май 2023",
    description: [
      "Проработка архитектуры приложения с нуля",
      "Разработка клиент-серверных взаимодействий",
      "Реализация приложения в рамках трёхуровневой архитектуры UI-BLL-DAL",
      "Обработка ошибок и внедрение прелоадеров для улучшения UX",
    ],
    technologies:
      "JavaScript, TypeScript, React, MUI UI, Git, HTML, CSS, Figma, REST API",
    logo: "/assets/icons/experience/qcup.svg",
    link: "https://github.com/InfinityScripter",
  },
  {
    position: "Frontend Developer (JS)",
    company: "Яндекс",
    location: "Санкт-Петербург",
    period: "Май 2023 — Октябрь 2023",
    description: [
      "Оптимизация UI-документации для Userver, ведущего C++ фреймворка",
      "Улучшение документации и кодовой базы",
      "Перевод на новый UI-кит",
    ],
    technologies: "JavaScript, Git, HTML, CSS, Figma, jQuery",
    logo: "/assets/icons/experience/yandex.png",
    link: "https://userver.tech",
  },
  {
    position: "Frontend Developer (React, JS)",
    company: "ShurikMarket",
    location: "Санкт-Петербург",
    period: "Октябрь 2023 — Май 2024",
    description: [
      "Ускорение первичной загрузки страницы сайта",
      "Разработка новых сервисов (новости, сертификаты, обратная связь, избранные товары)",
      "Разработка и внедрение функционала регистрации и авторизации пользователей",
      "Вёрстка нового лендинга по макетам Pixel Perfect",
      "Внедрение внутреннего UI kit",
    ],
    technologies:
      "JavaScript, TypeScript, React JS, Next.js, Material UI, Git, HTML, CSS, Figma, Webpack, PHP, Twig, Symfony",
    logo: "/assets/icons/experience/shurikmarket.ico",
    link: "https://shurik.market",
  },
  {
    position: "Frontend Developer (Angular, TS)",
    company: "СТОМПЛАН",
    location: "Москва",
    period: "Май 2024 — настоящее время",
    description: [
      "Разработка мастера презентаций с возможностью выгрузки в PDF",
      "Подготовка проекта к переходу на Angular",
      "Внедрение новых интерактивных блоков",
      "Успешный старт и запуск продукта в MVP",
    ],
    technologies:
      "JavaScript, TypeScript, Angular, Git, HTML, CSS, Figma, Webpack, REST API",
    logo: "/assets/icons/experience/stomplan.ico",
    link: "https://stomplan.ru",
  },
];

export default function HomeExperience() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
          <Typography variant="h2">Опыт работы</Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography sx={{ color: "text.secondary" }}>
            Мой профессиональный путь как веб-разработчика
          </Typography>
        </m.div>
      </Stack>

      <Timeline
        position={isMobile ? "right" : "alternate"}
        sx={{
          [`& .MuiTimelineItem-root`]: {
            minHeight: { xs: "auto", md: "70px" },
            "&:before": {
              // This removes the line on the left side for mobile view
              display: { xs: "none", md: "block" },
            },
          },
          px: { xs: 0, sm: 2 },
        }}
      >
        {EXPERIENCE.sort(
          (a, b) =>
            new Date(b.period.split(" — ")[0]) -
            new Date(a.period.split(" — ")[0]),
        ).map((item, index) => (
          <TimelineItem key={index}>
            <TimelineOppositeContent
              sx={{
                m: "auto 0",
                display: { xs: isMobile ? "none" : "block", md: "block" },
                flex: { xs: 0, md: 1 },
              }}
            >
              <m.div variants={varFade().inLeft}>
                <Typography variant="subtitle1" color="text.primary">
                  {item.period}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.location}
                </Typography>
              </m.div>
            </TimelineOppositeContent>

            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot
                sx={{
                  bgcolor: "background.paper",
                  boxShadow: theme.customShadows.z8,
                  p: 0,
                  overflow: "hidden",
                  width: { xs: 40, md: 48 },
                  height: { xs: 40, md: 48 },
                }}
              >
                <Avatar
                  src={item.logo}
                  alt={`${item.company} logo`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    p: 0.5,
                  }}
                />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>

            <TimelineContent sx={{ py: "12px", px: { xs: 1, sm: 2 } }}>
              <m.div variants={varFade().inRight}>
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noopener"
                  underline="none"
                  sx={{
                    "&:hover": {
                      "& .MuiPaper-root": {
                        boxShadow: theme.customShadows.z24,
                        transition: theme.transitions.create("box-shadow", {
                          duration: theme.transitions.duration.shorter,
                        }),
                      },
                    },
                  }}
                >
                  <Paper
                    sx={{
                      p: { xs: 2, sm: 3 },
                      bgcolor: alpha(theme.palette.background.neutral, 0.8),
                      borderRadius: 2,
                      boxShadow: theme.customShadows.z1,
                    }}
                  >
                    <Typography variant="h6" component="div" gutterBottom>
                      {item.position}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="primary.main"
                      gutterBottom
                    >
                      {item.company}
                    </Typography>

                    {/* Show period and location on mobile */}
                    {isMobile && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {item.period} • {item.location}
                      </Typography>
                    )}

                    <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                      {item.description.map((desc, i) => (
                        <Typography
                          key={i}
                          component="li"
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          {desc}
                        </Typography>
                      ))}
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                      }}
                    >
                      <strong>Технологии:</strong> {item.technologies}
                    </Typography>
                  </Paper>
                </Link>
              </m.div>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Container>
  );
}
