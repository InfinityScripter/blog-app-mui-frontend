import { useState } from "react";
import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { varAlpha } from "src/theme/styles";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { varFade, MotionViewport } from "src/components/animate";
import Accordion, { accordionClasses } from "@mui/material/Accordion";
import AccordionDetails, {
  accordionDetailsClasses,
} from "@mui/material/AccordionDetails";
import AccordionSummary, {
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";

import { SectionTitle } from "./components/section-title";
import {
  FloatLine,
  FloatPlusIcon,
  FloatTriangleDownIcon,
} from "./components/svg-elements";

// ----------------------------------------------------------------------

const FAQs = [
  {
    question: "Как часто выходят новые публикации?",
    answer: (
      <Typography>
        Новые материалы публикуются регулярно: практические кейсы, разборы
        архитектуры и статьи по фронтенд-разработке.
      </Typography>
    ),
  },
  {
    question: "Какие темы разбираются в блоге?",
    answer: (
      <Box component="ul" sx={{ pl: 3, listStyleType: "disc" }}>
        <li>React, Next.js, TypeScript</li>
        <li>Архитектура клиентских приложений</li>
        <li>Производительность и DX</li>
        <li>UI/UX практики и паттерны проектирования</li>
      </Box>
    ),
  },
  {
    question: "Есть ли материалы для начинающих?",
    answer: (
      <Typography>
        Да. Есть как вводные статьи, так и продвинутые разборы для
        продакшен-задач.
      </Typography>
    ),
  },
  {
    question: "Можно ли использовать примеры кода в проектах?",
    answer: (
      <Typography>
        Да, примеры можно адаптировать под реальные продукты с учетом ваших
        требований.
      </Typography>
    ),
  },
  {
    question: "Где можно задать вопрос по материалам?",
    answer: (
      <Typography>
        Быстрее всего — через Telegram или GitHub. Ссылки есть в блоке контактов
        ниже.
      </Typography>
    ),
  },
  {
    question: "Можно предложить тему для статьи?",
    answer: (
      <Typography>
        Да, присылайте идеи и кейсы из практики — это помогает делать контент
        полезнее.
      </Typography>
    ),
  },
];

// ----------------------------------------------------------------------

export function HomeFAQs({ sx, ...other }) {
  const [expanded, setExpanded] = useState(FAQs[0].question);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const renderDescription = (
    <SectionTitle
      caption="FAQ"
      title="Отвечаю на"
      txtGradient="частые вопросы"
      sx={{ textAlign: "center" }}
    />
  );

  const renderContent = (
    <Stack
      spacing={1}
      sx={{
        mt: 8,
        mx: "auto",
        maxWidth: 720,
        mb: { xs: 5, md: 8 },
      }}
    >
      {FAQs.map((item, index) => (
        <Accordion
          key={item.question}
          component={m.div}
          variants={varFade({ distance: 24 }).inUp}
          expanded={expanded === item.question}
          onChange={handleChange(item.question)}
          sx={{
            borderRadius: 2,
            transition: (theme) =>
              theme.transitions.create(["background-color"], {
                duration: theme.transitions.duration.short,
              }),
            "&::before": { display: "none" },
            "&:hover": {
              bgcolor: (theme) =>
                varAlpha(theme.vars.palette.grey["500Channel"], 0.16),
            },
            "&:first-of-type, &:last-of-type": { borderRadius: 2 },
            [`&.${accordionClasses.expanded}`]: {
              m: 0,
              borderRadius: 2,
              boxShadow: "none",
              bgcolor: (theme) =>
                varAlpha(theme.vars.palette.grey["500Channel"], 0.08),
            },
            [`& .${accordionSummaryClasses.root}`]: {
              py: 3,
              px: 2.5,
              minHeight: "auto",
              [`& .${accordionSummaryClasses.content}`]: {
                m: 0,
                [`&.${accordionSummaryClasses.expanded}`]: { m: 0 },
              },
            },
            [`& .${accordionDetailsClasses.root}`]: { px: 2.5, pt: 0, pb: 3 },
          }}
        >
          <AccordionSummary
            expandIcon={
              <Iconify
                width={20}
                icon={
                  expanded === item.question
                    ? "mingcute:minimize-line"
                    : "mingcute:add-line"
                }
              />
            }
            aria-controls={`panel${index}bh-content`}
            id={`panel${index}bh-header`}
          >
            <Typography variant="h6"> {item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>{item.answer}</AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );

  const renderContact = (
    <Stack
      alignItems="center"
      sx={{
        px: 3,
        py: 8,
        textAlign: "center",
        background: (theme) =>
          `linear-gradient(270deg, ${varAlpha(theme.vars.palette.grey["500Channel"], 0.08)}, ${varAlpha(theme.vars.palette.grey["500Channel"], 0)})`,
      }}
    >
      <m.div variants={varFade().in}>
        <Typography variant="h4">Остались вопросы?</Typography>
      </m.div>

      <m.div variants={varFade().in}>
        <Typography sx={{ mt: 2, mb: 3, color: "text.secondary" }}>
          Напишите в соцсети, чтобы быстро обсудить задачу и детали.
        </Typography>
      </m.div>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <m.div variants={varFade().in}>
          <Button
            color="inherit"
            variant="contained"
            href="https://t.me/sh0ny/"
            target="_blank"
            rel="noopener"
            startIcon={<Iconify icon="ri:telegram-fill" />}
          >
            Telegram
          </Button>
        </m.div>
        <m.div variants={varFade().in}>
          <Button
            color="inherit"
            variant="outlined"
            href="https://github.com/InfinityScripter"
            target="_blank"
            rel="noopener"
            startIcon={<Iconify icon="akar-icons:github-fill" />}
          >
            GitHub
          </Button>
        </m.div>
      </Stack>
    </Stack>
  );

  return (
    <Stack component="section" sx={{ ...sx }} {...other}>
      <MotionViewport sx={{ py: 10, position: "relative" }}>
        <TopLines />

        <Container>
          {renderDescription}
          {renderContent}
        </Container>

        <Stack sx={{ position: "relative" }}>
          <BottomLines />
          {renderContact}
        </Stack>
      </MotionViewport>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function TopLines() {
  return (
    <>
      <Stack
        spacing={8}
        alignItems="center"
        sx={{
          top: 64,
          left: 80,
          position: "absolute",
          transform: "translateX(-15px)",
        }}
      >
        <FloatTriangleDownIcon sx={{ position: "static", opacity: 0.12 }} />
        <FloatTriangleDownIcon
          sx={{
            position: "static",
            opacity: 0.24,
            width: 30,
            height: 15,
          }}
        />
      </Stack>
      <FloatLine vertical sx={{ top: 0, left: 80 }} />
    </>
  );
}

function BottomLines() {
  return (
    <>
      <FloatLine sx={{ top: 0, left: 0 }} />
      <FloatLine sx={{ bottom: 0, left: 0 }} />
      <FloatPlusIcon sx={{ top: -8, left: 72 }} />
      <FloatPlusIcon sx={{ bottom: -8, left: 72 }} />
    </>
  );
}
