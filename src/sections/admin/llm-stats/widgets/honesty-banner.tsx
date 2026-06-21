import type { LlmStats } from "src/sections/admin/llm-stats/types";

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export function HonestyBanner({ stats }: { stats: LlmStats }) {
  return (
    <Stack spacing={1}>
      <Alert severity="info">
        Стоимость — приблизительная оценка по публичным прайс-листам, не
        биллинг.
      </Alert>
      {stats.meta.warnings.map((w) => (
        <Alert key={w} severity="warning">
          {w}
        </Alert>
      ))}
    </Stack>
  );
}
