import Box from "@mui/material/Box";
import { useTranslations } from "next-intl";
import Typography from "@mui/material/Typography";

import { MInview } from "./m-inview";

// ----------------------------------------------------------------------

export function HeroSubtitle() {
  const t = useTranslations("home");

  return (
    <MInview>
      <Typography
        component="p"
        variant="h5"
        sx={{ maxWidth: 420, fontWeight: 600, lineHeight: 1.45 }}
      >
        {t("hero.subtitleBefore")}
        <Box component="span" className="ls-highlight">
          {t("hero.subtitleAccent")}
        </Box>
        {t("hero.subtitleAfter")}
      </Typography>
    </MInview>
  );
}
