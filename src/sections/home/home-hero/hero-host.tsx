import Box from "@mui/material/Box";
import { useTranslations } from "next-intl";

import { MInview } from "./m-inview";
import { HERO_HOST_SRC } from "./const";

// ----------------------------------------------------------------------

export function HeroHost() {
  const t = useTranslations("home");

  return (
    <MInview>
      <Box
        component="img"
        src={HERO_HOST_SRC}
        alt={t("hero.imageAlt")}
        width={560}
        height={560}
        fetchPriority="high"
        sx={{
          display: "block",
          width: 1,
          maxWidth: { xs: 320, md: 480 },
          height: "auto",
          mx: "auto",
        }}
      />
    </MInview>
  );
}
