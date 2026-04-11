import type { Theme, SxProps } from "@mui/material/styles";

import { alpha } from "@mui/material/styles";

import { varAlpha } from "./utils";
import { textGradient } from "./mixins";

// ----------------------------------------------------------------------
// Shared marketing / landing patterns: hero, section titles, dark-on-light text fades,
// white-on-dark fades, warning↔primary blends. Prefer these over inline `textGradient(...)`.

/** Framer Motion: slow drift for primary/warning gradient text (matches HomeHero). */
export const MARKETING_HEADLINE_GRADIENT_ANIMATE = {
  backgroundPosition: "200% center",
} as const;

export const MARKETING_HEADLINE_GRADIENT_TRANSITION = {
  duration: 20,
  ease: "linear",
  repeat: Infinity,
  repeatType: "reverse" as const,
};

export const marketingHeadlineGradientCss = (theme: Theme): string => {
  const { primary, warning } = theme.vars.palette;

  return `300deg, ${primary.main} 0%, ${warning.main} 25%, ${primary.main} 50%, ${warning.main} 75%, ${primary.main} 100%`;
};

/** Gradient clip text + shimmer sizing + spacing after preceding word (HomeHero / portfolio). */
export const marketingHeadlineHighlightSx = (theme: Theme): SxProps<Theme> => ({
  ...textGradient(marketingHeadlineGradientCss(theme)),
  backgroundSize: "400%",
  ml: { xs: 0.75, md: 1, xl: 1.5 },
});

/** Soft primary tint band for compact marketing sections (e.g. portfolio hero). */
export const marketingHeroTintBandSx = (theme: Theme): SxProps<Theme> => ({
  py: { xs: 10, md: 14 },
  bgcolor: alpha(
    theme.palette.primary.main,
    theme.palette.mode === "dark" ? 0.12 : 0.06,
  ),
});

/** Flex row of primary CTAs (matches HomeHero button strip). */
export const marketingHeroCtaRowSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: { xs: 1.5, sm: 2 },
};

/** Centered lead blurb under hero title. */
export const marketingHeroLeadSx: SxProps<Theme> = {
  maxWidth: 760,
  mx: "auto",
};

/** Outlined stat / metric cell inside a grid. */
export const marketingStatPaperSx: SxProps<Theme> = {
  p: 2.5,
  height: 1,
};

// —— Text fades (no motion) ——————————————————————————————————————————————

/** Default body: solid `text.primary` → transparent (section title accent word, muted labels). */
export const marketingTextPrimaryFadeGradientCss = (theme: Theme): string =>
  `to right, ${theme.vars.palette.text.primary}, ${varAlpha(theme.vars.palette.text.primaryChannel, 0.2)}`;

export const marketingTextPrimaryFadeSx = (theme: Theme): SxProps<Theme> => ({
  ...textGradient(marketingTextPrimaryFadeGradientCss(theme)),
});

/** Dark sections: white → faded white (`endAlpha` tail opacity for the fade stop). */
export const marketingWhiteFadeGradientCss = (
  theme: Theme,
  endAlpha = 0.2,
): string =>
  `to right, ${theme.vars.palette.common.white}, ${varAlpha(theme.vars.palette.common.whiteChannel, endAlpha)}`;

export const marketingWhiteFadeSx = (
  theme: Theme,
  endAlpha = 0.2,
): SxProps<Theme> => ({
  ...textGradient(marketingWhiteFadeGradientCss(theme, endAlpha)),
});

/** Full heading strip: warning → primary (e.g. “For designer” block title). */
export const marketingWarningPrimaryBlendGradientCss = (
  theme: Theme,
): string => {
  const { warning, primary } = theme.vars.palette;

  return `135deg, ${warning.main}, ${primary.main}`;
};

export const marketingWarningPrimaryBlendSx = (
  theme: Theme,
): SxProps<Theme> => ({
  ...textGradient(marketingWarningPrimaryBlendGradientCss(theme)),
});

/** Testimonials / stats row label: primary fade + h6 + opacity. */
export const marketingMutedStatLabelSx = (theme: Theme): SxProps<Theme> => ({
  ...textGradient(marketingTextPrimaryFadeGradientCss(theme)),
  opacity: 0.4,
  typography: "h6",
});
