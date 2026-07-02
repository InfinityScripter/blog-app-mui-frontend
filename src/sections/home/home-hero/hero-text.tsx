import Typography from "@mui/material/Typography";

import { MInview } from "./m-inview";
import { HERO_SUMMARY } from "./const";

// ----------------------------------------------------------------------

// Лид под заголовком: спокойный графитовый абзац, мера ≤65ch.
export function HeroText() {
  return (
    <MInview>
      <Typography
        variant="body1"
        sx={{
          maxWidth: "65ch",
          color: "text.secondary",
          fontSize: { xs: 16, md: 18 },
          lineHeight: 1.7,
        }}
      >
        {HERO_SUMMARY}
      </Typography>
    </MInview>
  );
}
