import { useTranslations } from "next-intl";
import Typography from "@mui/material/Typography";

import { MInview } from "./m-inview";

// ----------------------------------------------------------------------

// Лид под заголовком: спокойный графитовый абзац, мера ≤65ch.
export function HeroText() {
  const t = useTranslations("home");

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
        {t("hero.summary")}
      </Typography>
    </MInview>
  );
}
