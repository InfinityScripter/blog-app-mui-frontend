import type { Theme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { hairline } from "src/theme/styles";
import Container from "@mui/material/Container";
import { MotionContainer } from "src/components/animate";

import { HeroText } from "./hero-text";
import { HeroButtons } from "./hero-buttons";
import { HeroHeading } from "./hero-content";
import { HeroMetaPanel } from "./hero-meta-panel";

import type { HomeHeroProps } from "./types";

// ----------------------------------------------------------------------

// Асимметричный editorial-герой: текстовая колонка слева (7/12), индекс
// журнала справа (5/12). Без параллакса, фиксированных слоёв и SVG-декора.
export function HomeHero({ sx, ...other }: HomeHeroProps) {
  return (
    <Box
      component="section"
      sx={{
        borderBottom: (theme: Theme) => hairline(theme),
        ...sx,
      }}
      {...other}
    >
      <Container
        component={MotionContainer}
        sx={{ py: { xs: 8, md: "clamp(4rem, 9vw, 7rem)" } }}
      >
        <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={4} alignItems="flex-start">
              <HeroHeading />
              <HeroText />
              <HeroButtons />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <HeroMetaPanel />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
