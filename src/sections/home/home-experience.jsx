import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import Container from '@mui/material/Container';
import TimelineItem from '@mui/lab/TimelineItem';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const EXPERIENCE = [
  {
    position: 'Frontend Developer (Angular, TS)',
    company: 'СТОМПЛАН',
    location: 'Москва',
    period: 'Май 2024 — настоящее время',
    description: [
      'Разработка мастера презентаций с возможностью выгрузки в PDF',
      'Подготовка проекта к переходу на Angular',
      'Внедрение новых интерактивных блоков',
      'Успешный старт и запуск продукта в MVP'
    ],
    technologies: 'JavaScript, TypeScript, Angular, Git, HTML, CSS, Figma, Webpack, REST API',
    icon: 'mdi:angular'
  },
  {
    position: 'Frontend Developer (React, JS)',
    company: 'ShurikMarket',
    location: 'Санкт-Петербург',
    period: 'Октябрь 2023 — Май 2024',
    description: [
      'Ускорение первичной загрузки страницы сайта',
      'Разработка новых сервисов (новости, сертификаты, обратная связь, избранные товары)',
      'Разработка и внедрение функционала регистрации и авторизации пользователей',
      'Вёрстка нового лендинга по макетам Pixel Perfect',
      'Внедрение внутреннего UI kit'
    ],
    technologies: 'JavaScript, TypeScript, React JS, Next.js, Material UI, Git, HTML, CSS, Figma, Webpack, PHP, Twig, Symfony',
    icon: 'mdi:react'
  },
  {
    position: 'Frontend Developer (JS)',
    company: 'Яндекс',
    location: 'Санкт-Петербург',
    period: 'Май 2023 — Октябрь 2023',
    description: [
      'Оптимизация UI-документации для Userver, ведущего C++ фреймворка',
      'Улучшение документации и кодовой базы',
      'Перевод на новый UI-кит'
    ],
    technologies: 'JavaScript, Git, HTML, CSS, Figma, jQuery',
    icon: 'mdi:yandex'
  },
  {
    position: 'Frontend Developer (React, TS)',
    company: 'QCup',
    location: 'Санкт-Петербург',
    period: 'Ноябрь 2022 — Май 2023',
    description: [
      'Проработка архитектуры приложения с нуля',
      'Разработка клиент-серверных взаимодействий',
      'Реализация приложения в рамках трёхуровневой архитектуры UI-BLL-DAL',
      'Обработка ошибок и внедрение прелоадеров для улучшения UX'
    ],
    technologies: 'JavaScript, TypeScript, React, MUI UI, Git, HTML, CSS, Figma, REST API',
    icon: 'mdi:code-braces'
  }
];

export default function HomeExperience() {
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
          textAlign: 'center',
          mb: { xs: 5, md: 10 },
        }}
      >
        <m.div variants={varFade().inDown}>
          <Typography variant="h2">Work Experience</Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography sx={{ color: 'text.secondary' }}>
            My professional journey as a frontend developer
          </Typography>
        </m.div>
      </Stack>

      <Timeline position="alternate">
        {EXPERIENCE.map((item, index) => (
          <TimelineItem key={index}>
            <TimelineOppositeContent sx={{ m: 'auto 0' }}>
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
                  bgcolor: theme.palette.primary.main,
                  p: 1.5,
                }}
              >
                <Iconify icon={item.icon} width={24} sx={{ color: '#fff' }} />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>

            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <m.div variants={varFade().inRight}>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: alpha(theme.palette.background.neutral, 0.8),
                    borderRadius: 2,
                    boxShadow: theme.customShadows.z8,
                  }}
                >
                  <Typography variant="h6" component="div" gutterBottom>
                    {item.position}
                  </Typography>
                  <Typography variant="subtitle1" color="primary.main" gutterBottom>
                    {item.company}
                  </Typography>
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
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    <strong>Tech stack:</strong> {item.technologies}
                  </Typography>
                </Paper>
              </m.div>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Container>
  );
}
