import type { BoxProps } from "@mui/material/Box";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { useRef, useState } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import { textGradient } from "src/theme/styles";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { useResponsive } from "src/hooks/use-responsive";
import { varFade, MotionContainer } from "src/components/animate";
import {
  m,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

import { HeroBackground } from "../components/hero-background";
import {
  LG_KEY,
  MD_KEY,
  SM_KEY,
  HERO_LABEL,
  HERO_TITLE,
  HERO_SUMMARY,
  HERO_HIGHLIGHT,
  HERO_HEADLINE_SIZE,
  HERO_BLOG_INFO_TITLE,
  HERO_HEADLINE_MAX_WIDTH,
  HERO_HEADLINE_LINE_HEIGHT,
  HERO_BLOG_INFO_DESCRIPTION,
} from "./const";

// Функции-хелперы остаются без изменений
function MInview({ children, component = m.div }) {
  return (
    <Box component={component} variants={varFade({ distance: 24 }).inUp}>
      {children}
    </Box>
  );
}

function useTransformY(value, distance) {
  const physics = {
    mass: 0.1,
    damping: 20,
    stiffness: 300,
    restDelta: 0.001,
  };

  return useSpring(useTransform(value, [0, 1], [0, distance]), physics);
}

function useScrollPercent() {
  const elementRef = useRef(null);
  const { scrollY } = useScroll();
  const [percent, setPercent] = useState(0);

  useMotionValueEvent(scrollY, "change", (scrollHeight) => {
    let heroHeight = 0;
    if (elementRef.current) {
      heroHeight = elementRef.current.offsetHeight;
    }
    const scrollPercent = Math.floor((scrollHeight / heroHeight) * 100);
    setPercent(scrollPercent >= 100 ? 100 : Math.floor(scrollPercent));
  });

  return { elementRef, percent, scrollY };
}

type HomeHeroProps = BoxProps;

export function HomeHero({ sx, ...other }: HomeHeroProps) {
  const theme = useTheme();
  const scroll = useScrollPercent();
  const mdUp = useResponsive("up", MD_KEY);
  const distance = mdUp ? scroll.percent : 0;

  const y1 = useTransformY(scroll.scrollY, distance * -7);
  const y2 = useTransformY(scroll.scrollY, distance * -6);
  const y4 = useTransformY(scroll.scrollY, distance * -4);

  const opacity = useTransform(
    scroll.scrollY,
    [0, 1],
    [1, mdUp ? Number((1 - scroll.percent / 100).toFixed(1)) : 1],
  );

  // Заголовок главной страницы с фокусом на блоге
  const renderHeading = (
    <MInview>
      <Box
        component="h1"
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        sx={{
          ...theme.typography.h2,
          my: 0,
          mx: "auto",
          maxWidth: HERO_HEADLINE_MAX_WIDTH,
          fontFamily: theme.typography.fontSecondaryFamily,
          fontSize: HERO_HEADLINE_SIZE,
          lineHeight: HERO_HEADLINE_LINE_HEIGHT,
        }}
      >
        <Box component="span" sx={{ width: 1, opacity: 0.24, mr: 1 }}>
          {HERO_LABEL}
        </Box>
        <Box
          component={m.span}
          animate={{ backgroundPosition: "200% center" }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          sx={{
            ...textGradient(
              `300deg, ${theme.vars.palette.primary.main} 0%, ${theme.vars.palette.warning.main} 25%, ${theme.vars.palette.primary.main} 50%, ${theme.vars.palette.warning.main} 75%, ${theme.vars.palette.primary.main} 100%`,
            ),
            backgroundSize: "400%",
            ml: { xs: 0.75, md: 1, xl: 1.5 },
          }}
        >
          {HERO_HIGHLIGHT}
        </Box>
      </Box>
      <Box
        component="h2"
        sx={{ mt: 1, textAlign: "center", ...theme.typography.h5 }}
      >
        {HERO_TITLE}
      </Box>
    </MInview>
  );

  // Краткое описание тем блога
  const renderText = (
    <MInview>
      <Typography
        variant="body2"
        sx={{
          mx: "auto",
          [theme.breakpoints.up(SM_KEY)]: { whiteSpace: "pre-line" },
          [theme.breakpoints.up(LG_KEY)]: { fontSize: 20, lineHeight: "36px" },
        }}
      >
        {HERO_SUMMARY}
      </Typography>
    </MInview>
  );

  // Кнопки для перехода к портфолио и статьям
  const renderButtons = (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
      gap={{ xs: 1.5, sm: 2 }}
    >
      <MInview>
        <Button
          component={Link}
          href="/portfolio"
          color="primary"
          size="large"
          variant="contained"
          startIcon={
            <Iconify width={24} icon="solar:user-circle-bold-duotone" />
          }
        >
          Портфолио
        </Button>
      </MInview>
      <MInview>
        <Button
          component={Link}
          href="/post"
          color="primary"
          size="large"
          variant="outlined"
          startIcon={
            <Iconify width={24} icon="mdi:newspaper-variant-outline" />
          }
        >
          Читать блог
        </Button>
      </MInview>
    </Box>
  );

  // Информация о блоге
  const renderBlogInfo = (
    <MInview>
      <Box sx={{ textAlign: "center", maxWidth: 600, mx: "auto", mt: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          {HERO_BLOG_INFO_TITLE}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          {HERO_BLOG_INFO_DESCRIPTION}
        </Typography>
      </Box>
    </MInview>
  );

  return (
    <Stack
      ref={scroll.elementRef}
      component="section"
      sx={{
        overflow: "hidden",
        position: "relative",
        [theme.breakpoints.up(MD_KEY)]: {
          minHeight: 760,
          height: "100vh",
          maxHeight: 1440,
          display: "block",
          willChange: "opacity",
          mt: "calc(var(--layout-header-desktop-height) * -1)",
        },
        ...sx,
      }}
      {...other}
    >
      <Box
        component={m.div}
        style={{ opacity }}
        sx={{
          width: 1,
          display: "flex",
          position: "relative",
          flexDirection: "column",
          transition: theme.transitions.create(["opacity"]),
          [theme.breakpoints.up(MD_KEY)]: {
            height: 1,
            position: "fixed",
            maxHeight: "inherit",
          },
        }}
      >
        <Container
          component={MotionContainer}
          sx={{
            py: 3,
            gap: 5,
            zIndex: 9,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            [theme.breakpoints.up(MD_KEY)]: {
              flex: "1 1 auto",
              justifyContent: "center",
              py: "var(--layout-header-desktop-height)",
            },
          }}
        >
          <Stack spacing={3} sx={{ textAlign: "center" }}>
            <m.div style={{ y: y1 }}>{renderHeading}</m.div>
            <m.div style={{ y: y2 }}>{renderText}</m.div>
            <m.div style={{ y: y4 }}>{renderButtons}</m.div>
            <m.div style={{ y: y4 }}>{renderBlogInfo}</m.div>
          </Stack>
        </Container>

        <HeroBackground />
      </Box>
    </Stack>
  );
}
