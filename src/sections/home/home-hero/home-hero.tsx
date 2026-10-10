import type { Theme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { hairline } from "src/theme/styles";
import Container from "@mui/material/Container";
import { MotionContainer } from "src/components/animate";

import { HeroText } from "./hero-text";
import { HeroHost } from "./hero-host";
import { HeroButtons } from "./hero-buttons";
import { HeroHeading } from "./hero-content";

import type { HomeHeroProps } from "./types";

// ----------------------------------------------------------------------

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
        <Grid
          container
          spacing={{ xs: 6, md: 10 }}
          sx={{
            alignItems: "center",
          }}
        >
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack
              spacing={4}
              sx={{
                alignItems: "flex-start",
              }}
            >
              <HeroHeading />
              <HeroText />
              <HeroButtons />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <HeroHost />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
