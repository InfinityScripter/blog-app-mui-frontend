"use client";

import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import { monoLabelSx } from "src/theme/styles";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

interface CompareHeroProps {
  /** How many models match the current filters. */
  shown: number;
  /** Total curated models. */
  total: number;
  /** ISO date prices/benchmarks were verified — shown as a provenance note. */
  pricingAsOf: string;
}

/**
 * Page header for the comparison matrix: eyebrow, title, one-line intent, and
 * an honest provenance/methodology note (prices are a dated snapshot, numbers
 * are vendor-reported). The result count makes filtering legible.
 */
export function CompareHero({ shown, total, pricingAsOf }: CompareHeroProps) {
  const t = useTranslations("llmCompare");

  const countLabel =
    shown === total
      ? t("hero.countAll", { total })
      : t("hero.countFiltered", { shown, total });

  return (
    <Stack spacing={1.5} sx={{ mb: { xs: 3, md: 5 } }}>
      <Typography component="p" sx={monoLabelSx}>
        {t("hero.eyebrow")}
      </Typography>
      <Typography variant="h2" component="h1">
        {t("hero.title")}
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "text.secondary", maxWidth: 720 }}
      >
        {t("hero.subtitle")}
      </Typography>
      <Typography
        variant="caption"
        sx={{ color: "text.disabled", maxWidth: 720 }}
      >
        {countLabel} · {t("hero.provenance", { pricingAsOf })}
      </Typography>
    </Stack>
  );
}
