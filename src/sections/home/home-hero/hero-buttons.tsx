import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTranslations } from "next-intl";
import { Iconify } from "src/components/iconify";

import { MInview } from "./m-inview";
import { HERO_SOCIAL_LINKS, HERO_START_ANCHOR } from "./const";

import type { HeroLinkKey } from "./types";

// ----------------------------------------------------------------------

interface HeroButtonsProps {
  onHover: (key?: HeroLinkKey) => void;
}

export function HeroButtons({ onHover }: HeroButtonsProps) {
  const t = useTranslations("home");

  return (
    <MInview>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 1.5, sm: 2 } }}>
        <Button
          href={`#${HERO_START_ANCHOR}`}
          size="large"
          variant="contained"
          color="primary"
          startIcon={<Iconify width={22} icon="mingcute:play-fill" />}
          className="ls-sticker-btn"
        >
          {t("hero.start")}
        </Button>
        {HERO_SOCIAL_LINKS.map((item) => (
          <Button
            key={item.key}
            href={item.href}
            target="_blank"
            rel="noopener"
            size="large"
            variant="outlined"
            color="inherit"
            startIcon={<Iconify width={22} icon={item.icon} />}
            className="ls-sticker-btn"
            sx={{ bgcolor: "background.default" }}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") onHover(item.key);
            }}
            onPointerLeave={() => onHover()}
            onFocus={(event) => {
              if (event.currentTarget.matches(":focus-visible")) {
                onHover(item.key);
              }
            }}
            onBlur={() => onHover()}
          >
            {t(`hero.${item.key}`)}
          </Button>
        ))}
      </Box>
    </MInview>
  );
}
