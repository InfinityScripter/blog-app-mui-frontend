import type { Theme } from "@mui/material/styles";

import { alpha } from "@mui/material/styles";

/** Герой: отступы + фон из CSS-токенов (фиксированный брендовый градиент). */
export function portfolioHeroSectionSx(theme: Theme) {
  return {
    py: { xs: 10, md: 14 },
    background: "var(--portfolio-hero-bg)",
  };
}

/** Карточка метрики: рамка и hover из палитры темы (как experience-карточки). */
export function portfolioMetricCardSx(theme: Theme) {
  const isDark = theme.palette.mode === "dark";
  const borderColor = isDark
    ? alpha(theme.palette.common.white, 0.34)
    : alpha(theme.palette.common.black, 0.22);

  return {
    p: 2.5,
    borderRadius: 2,
    bgcolor: "transparent",
    border: `1px solid ${borderColor}`,
    transition: theme.transitions.create(
      ["border-color", "background-color"],
      { duration: theme.transitions.duration.shorter },
    ),
    "&:hover": {
      borderColor: isDark
        ? alpha(theme.palette.common.white, 0.62)
        : alpha(theme.palette.primary.main, 0.6),
      bgcolor: isDark
        ? alpha(theme.palette.common.white, 0.03)
        : alpha(theme.palette.common.black, 0.02),
    },
  };
}
