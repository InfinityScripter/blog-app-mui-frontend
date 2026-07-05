import Box from "@mui/material/Box";
import { useTranslations } from "next-intl";
import { monoLabelSx } from "src/theme/styles";
import Typography from "@mui/material/Typography";

import { MInview } from "./m-inview";

// ----------------------------------------------------------------------

// Заголовок главной: mono-надзаголовок + h1 с одним сплошным акцентом.
export function HeroHeading() {
  const t = useTranslations("home");

  return (
    <MInview>
      <Typography component="p" sx={{ ...monoLabelSx, mb: 2 }}>
        {t("hero.overline")}
      </Typography>

      <Typography component="h1" variant="h1" sx={{ maxWidth: 680 }}>
        {t("hero.titleBefore")}
        <Box component="span" sx={{ color: "primary.main" }}>
          {t("hero.titleAccent")}
        </Box>
        {t("hero.titleAfter")}
      </Typography>
    </MInview>
  );
}
