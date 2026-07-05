import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import { useTranslations } from "next-intl";
import { Iconify } from "src/components/iconify";

import { MInview } from "./m-inview";

// ----------------------------------------------------------------------

// Один primary CTA (контент) + тихая outlined-ссылка на портфолио.
export function HeroButtons() {
  const t = useTranslations("home");

  return (
    <MInview>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 1.5, sm: 2 } }}>
        <Button
          component={Link}
          href="/post"
          color="primary"
          size="large"
          variant="contained"
          startIcon={
            <Iconify width={22} icon="mdi:newspaper-variant-outline" />
          }
        >
          {t("hero.ctaBlog")}
        </Button>

        <Button
          component={Link}
          href="/portfolio"
          color="inherit"
          size="large"
          variant="outlined"
        >
          {t("hero.ctaAbout")}
        </Button>
      </Box>
    </MInview>
  );
}
