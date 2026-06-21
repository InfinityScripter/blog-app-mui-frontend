import type { LlmStats } from "src/sections/admin/llm-stats/types";

import Grid from "@mui/material/Grid";
import { Kpi } from "src/sections/admin/llm-stats/widgets/kpi";
import { formatTokens } from "src/sections/admin/llm-stats/utils";
import {
  FAMILY_LABEL,
  HARNESS_LABEL,
} from "src/sections/admin/llm-stats/const";

export function KpiRow({ stats }: { stats: LlmStats }) {
  const k = stats.kpis;
  const cells = [
    { label: "Всего токенов", value: formatTokens(k.totalTokens) },
    {
      label: "Оценка стоимости",
      value: `$${Math.round(k.totalCostUsd).toLocaleString("en-US")}`,
    },
    { label: "Сессий", value: String(k.sessions) },
    { label: "Активных дней", value: String(k.activeDays) },
    {
      label: "Топ модель",
      value: k.topModelFamily
        ? (FAMILY_LABEL[k.topModelFamily] ?? k.topModelFamily)
        : "—",
    },
    {
      label: "Топ инструмент",
      value: k.topHarness ? HARNESS_LABEL[k.topHarness] : "—",
    },
  ];
  return (
    <Grid container spacing={3}>
      {cells.map((c) => (
        <Grid key={c.label} size={{ xs: 6, md: 2 }}>
          <Kpi label={c.label} value={c.value} />
        </Grid>
      ))}
    </Grid>
  );
}
