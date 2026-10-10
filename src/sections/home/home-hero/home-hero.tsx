import { m } from "framer-motion";
import Box from "@mui/material/Box";
import { useTranslations } from "next-intl";
import { monoLabelSx } from "src/theme/styles";
import { MotionContainer } from "src/components/animate";

import { HeroHost } from "./hero-host";
import { HeroButtons } from "./hero-buttons";
import { HeroSubtitle } from "./hero-content";
import { useHeroHost } from "./hooks/use-hero-host";
import { useHeroScroll } from "./hooks/use-hero-scroll";

// ----------------------------------------------------------------------

export function HomeHero() {
  const t = useTranslations("home");
  const host = useHeroHost();
  const scroll = useHeroScroll();
  const [topWord, bottomWord] = t("hero.title").split(" ");

  return (
    <Box component="section" className="ls-hero">
      <Box
        component={MotionContainer}
        className="ls-hero__stage ls-grain"
        sx={{ px: { xs: 2, md: 0 }, pt: { xs: 5, md: 0 } }}
      >
        <div className="ls-mesh" aria-hidden>
          <i />
          <i />
          <i />
        </div>

        <h1 className="ls-hero__title">
          <m.span className="ls-word ls-word--top" style={{ x: scroll.topX }}>
            {topWord}
          </m.span>{" "}
          <m.span
            className="ls-word ls-word--bottom ls-word--sticker"
            style={{ x: scroll.bottomX }}
          >
            {bottomWord}
          </m.span>
        </h1>

        <m.div
          className="ls-hero__night"
          style={{ opacity: scroll.night }}
          aria-hidden
        />

        <m.div
          className="ls-hero__host"
          style={{ scale: scroll.hostScale, transformOrigin: "50% 100%" }}
        >
          <HeroHost
            pose={host.pose}
            bubble={host.bubble}
            bubbleOpacity={scroll.fade}
            onTap={host.tap}
          />
        </m.div>

        <m.div
          className="ls-hero__meta"
          style={{ opacity: scroll.fade, visibility: scroll.metaVisibility }}
        >
          <HeroSubtitle />
          <HeroButtons onHover={host.setHovered} />
        </m.div>

        <m.span className="ls-scroll-hint" style={{ opacity: scroll.fade }}>
          <Box component="span" sx={monoLabelSx}>
            {t("hero.scrollHint")}
          </Box>
        </m.span>
      </Box>
    </Box>
  );
}
