import Box from "@mui/material/Box";
import { MarketingGradientHighlight } from "src/components/marketing";

import { MInview } from "./m-inview";
import {
  HERO_LABEL,
  HERO_TITLE,
  HERO_HIGHLIGHT,
  HERO_HEADLINE_SIZE,
  HERO_HEADLINE_MAX_WIDTH,
  HERO_HEADLINE_LINE_HEIGHT,
} from "./const";

import type { HeroContentProps } from "./types";

// ----------------------------------------------------------------------

// Заголовок главной страницы с фокусом на блоге
export function HeroHeading({ theme }: HeroContentProps) {
  return (
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
        <MarketingGradientHighlight>
          {HERO_HIGHLIGHT}
        </MarketingGradientHighlight>
      </Box>
      <Box
        component="h2"
        sx={{ mt: 1, textAlign: "center", ...theme.typography.h5 }}
      >
        {HERO_TITLE}
      </Box>
    </MInview>
  );
}
