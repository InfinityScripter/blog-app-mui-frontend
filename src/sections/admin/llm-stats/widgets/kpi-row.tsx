import type { LlmStats } from "src/sections/admin/llm-stats/types";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { formatTokens } from "src/sections/admin/llm-stats/utils";
import {
  FAMILY_LABEL,
  HARNESS_LABEL,
} from "src/sections/admin/llm-stats/const";

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <Card sx={{ p: 3, height: 1 }}>
      <Stack spacing={0.5}>
        <Typography
          variant="h4"
          sx={{ fontSize: { xs: 20, sm: 22, lg: 26 }, lineHeight: 1.2 }}
        >
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {label}
        </Typography>
      </Stack>
    </Card>
  );
}

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
