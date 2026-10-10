import Box from "@mui/material/Box";
import { useTranslations } from "next-intl";
import Typography from "@mui/material/Typography";

import { MInview } from "./m-inview";

// ----------------------------------------------------------------------

export function HeroHeading() {
  const t = useTranslations("home");

  return (
    <MInview>
      <Typography component="h1" variant="h1">
        {t("hero.title")}
      </Typography>

      <Typography component="p" variant="h3" sx={{ mt: 2, maxWidth: 560 }}>
        {t("hero.subtitleBefore")}
        <Box component="span" className="ls-highlight">
          {t("hero.subtitleAccent")}
        </Box>
        {t("hero.subtitleAfter")}
      </Typography>
    </MInview>
  );
}
