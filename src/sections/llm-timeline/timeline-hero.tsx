import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
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
  const vendorsCount = new Set(models.map((model) => model.vendor)).size;
  const years = models.map((model) => releaseYear(model.releaseDate));
  const span = years.length
    ? `${Math.min(...years)}–${Math.max(...years)}`
    : "—";

  const stats: HeroStat[] = [
    { value: String(models.length), label: "моделей" },
    { value: String(vendorsCount), label: "вендоров" },
    { value: span, label: "годы" },
  ];

  return (
    <Box sx={{ mb: { xs: 3, md: 4 } }}>
      <Typography variant="h3" component="h1" sx={{ mb: 1 }}>
        История больших языковых моделей
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "text.secondary", mb: { xs: 2, md: 3 }, maxWidth: 640 }}
      >
        Хронология ключевых LLM — от первых трансформеров до reasoning-моделей и
        агентов. Нажмите на модель, чтобы увидеть детали, факты и источники.
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
