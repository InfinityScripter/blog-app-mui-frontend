import Box from "@mui/material/Box";
import { monoLabelSx } from "src/theme/styles";
import Typography from "@mui/material/Typography";

import { MInview } from "./m-inview";
import { HERO_OVERLINE, HERO_TITLE_PARTS } from "./const";

// ----------------------------------------------------------------------

// Заголовок главной: mono-надзаголовок + h1 с одним сплошным акцентом.
export function HeroHeading() {
  return (
    <MInview>
      <Typography component="p" sx={{ ...monoLabelSx, mb: 2 }}>
        {HERO_OVERLINE}
      </Typography>

      <Typography component="h1" variant="h1" sx={{ maxWidth: 680 }}>
        {HERO_TITLE_PARTS.before}
        <Box component="span" sx={{ color: "primary.main" }}>
          {HERO_TITLE_PARTS.accent}
        </Box>
        {HERO_TITLE_PARTS.after}
      </Typography>
    </MInview>
  );
}
