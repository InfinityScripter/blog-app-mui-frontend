import { useTranslations } from "next-intl";
import Typography from "@mui/material/Typography";

import { MInview } from "./m-inview";

// ----------------------------------------------------------------------

export function HeroText() {
  const t = useTranslations("home");

  return (
    <MInview>
      <Typography
        variant="body1"
        sx={{ maxWidth: "65ch", color: "text.secondary", lineHeight: 1.7 }}
      >
        {t("hero.summary")}
      </Typography>
    </MInview>
  );
}
