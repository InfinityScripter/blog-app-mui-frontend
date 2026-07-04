import Stack from "@mui/material/Stack";
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
  const countLabel =
    shown === total ? `${total} моделей` : `${shown} из ${total} моделей`;

  return (
    <Stack spacing={1.5} sx={{ mb: { xs: 3, md: 5 } }}>
      <Typography component="p" sx={monoLabelSx}>
        Сравнение LLM
      </Typography>
      <Typography variant="h2" component="h1">
        Матрица сравнения языковых моделей
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "text.secondary", maxWidth: 720 }}
      >
        Цена, контекст и ключевые бенчмарки актуальных LLM — по числам, а не по
        обещаниям. Сортируйте по любой колонке, фильтруйте и закрепляйте до трёх
        моделей для очного сравнения.
      </Typography>
      <Typography
        variant="caption"
        sx={{ color: "text.disabled", maxWidth: 720 }}
      >
        {countLabel} · цены (стандартный тариф, $/1M токенов) и бенчмарки — по
        данным вендоров, проверено {pricingAsOf}. Неизвестные значения —
        прочерк, не выдумываются. Бенчмарки: MMLU, GPQA Diamond, SWE-bench
        Verified, AIME; условия у вендоров различаются.
      </Typography>
    </Stack>
  );
}
