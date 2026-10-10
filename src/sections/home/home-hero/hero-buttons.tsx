import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTranslations } from "next-intl";
import { Iconify } from "src/components/iconify";

import { MInview } from "./m-inview";
import { HERO_SOCIAL_LINKS } from "./const";

// ----------------------------------------------------------------------

export function HeroButtons() {
  const t = useTranslations("home");

  return (
    <MInview>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 1.5, sm: 2 } }}>
        {HERO_SOCIAL_LINKS.map((item, index) => (
          <Button
            key={item.key}
            href={item.href}
            target="_blank"
            rel="noopener"
            size="large"
            variant={index === 0 ? "contained" : "outlined"}
            color={index === 0 ? "primary" : "inherit"}
            startIcon={<Iconify width={22} icon={item.icon} />}
          >
            {t(`hero.${item.key}`)}
          </Button>
        ))}
      </Box>
    </MInview>
  );
}
