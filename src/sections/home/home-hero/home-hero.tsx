import type { BoxProps } from "@mui/material/Box";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import { useResponsive } from "src/hooks/use-responsive";
import { MotionContainer } from "src/components/animate";
import { m, useSpring, useTransform } from "framer-motion";

import { MD_KEY, PARALLAX_PHYSICS } from "./const";
import { useScrollPercent } from "./hooks/use-scroll-percent";
import { HeroBackground } from "../components/hero-background";
import {
  HeroText,
  HeroHeading,
  HeroButtons,
  HeroBlogInfo,
} from "./hero-content";

// ----------------------------------------------------------------------

type HomeHeroProps = BoxProps;

export function HomeHero({ sx, ...other }: HomeHeroProps) {
  const theme = useTheme();
  const scroll = useScrollPercent();
  const mdUp = useResponsive("up", MD_KEY);

  const getPercent = (sv: number) => {
    const hh = scroll.elementRef.current?.offsetHeight ?? 1;
    return Math.min(Math.floor((sv / hh) * 100), 100);
  };

  const y1 = useSpring(
    useTransform(scroll.scrollY, (sv) => (mdUp ? sv * getPercent(sv) * -7 : 0)),
    PARALLAX_PHYSICS,
  );
  const y2 = useSpring(
    useTransform(scroll.scrollY, (sv) => (mdUp ? sv * getPercent(sv) * -6 : 0)),
    PARALLAX_PHYSICS,
  );
  const y4 = useSpring(
    useTransform(scroll.scrollY, (sv) => (mdUp ? sv * getPercent(sv) * -4 : 0)),
    PARALLAX_PHYSICS,
  );

  const opacity = useTransform(scroll.scrollY, (sv) =>
    mdUp ? Number((1 - getPercent(sv) / 100).toFixed(1)) : 1,
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
            <m.div style={{ y: y1 }}>
              <HeroHeading theme={theme} />
            </m.div>
            <m.div style={{ y: y2 }}>
              <HeroText theme={theme} />
            </m.div>
            <m.div style={{ y: y4 }}>
              <HeroButtons />
            </m.div>
            <m.div style={{ y: y4 }}>
              <HeroBlogInfo theme={theme} />
            </m.div>
          </Stack>
        </Container>

        <HeroBackground />
      </Box>
    </Stack>
  );
}
