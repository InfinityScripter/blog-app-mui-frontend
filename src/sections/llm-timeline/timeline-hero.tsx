import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { releaseYear } from "./utils";

import type { LlmModel } from "./types";

// ----------------------------------------------------------------------

interface TimelineHeroProps {
  models: LlmModel[];
}

interface HeroStat {
  value: string;
  label: string;
}

/**
 * Page header: title, subtitle and three key metrics (models, vendors, year
 * span) so the scope of the timeline is clear before scrolling.
 */
export function TimelineHero({ models }: TimelineHeroProps) {
  const t = useTranslations("llmTimeline");

  const vendorsCount = new Set(models.map((model) => model.vendor)).size;
  const years = models.map((model) => releaseYear(model.releaseDate));
  const span = years.length
    ? `${Math.min(...years)}–${Math.max(...years)}`
    : "—";

  const stats: HeroStat[] = [
    { value: String(models.length), label: t("hero.stats.models") },
    { value: String(vendorsCount), label: t("hero.stats.vendors") },
    { value: span, label: t("hero.stats.years") },
  ];

  return (
    <Box sx={{ mb: { xs: 3, md: 4 } }}>
      <Typography variant="h2" component="h1" sx={{ mb: 1 }}>
        {t("hero.title")}
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "text.secondary", mb: { xs: 2, md: 3 }, maxWidth: 640 }}
      >
        {t("hero.subtitle")}
      </Typography>

      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={{ xs: 2, md: 3 }}
      >
        {stats.map((stat) => (
          <Box key={stat.label}>
            <Typography variant="h4" component="p">
              {stat.value}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              {stat.label}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
