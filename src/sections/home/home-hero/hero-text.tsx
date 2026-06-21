import Typography from "@mui/material/Typography";

import { MInview } from "./m-inview";
import { LG_KEY, SM_KEY, HERO_SUMMARY } from "./const";

import type { HeroContentProps } from "./types";

// ----------------------------------------------------------------------

// Краткое описание тем блога
export function HeroText({ theme }: HeroContentProps) {
  return (
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
}
