"use client";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useGetLlmStats } from "src/actions/llm-stats";
import { renderState } from "src/sections/admin/llm-stats/utils";
import { KpiRow } from "src/sections/admin/llm-stats/widgets/kpi-row";
import { ModelTable } from "src/sections/admin/llm-stats/widgets/model-table";
import { TrendChart } from "src/sections/admin/llm-stats/widgets/trend-chart";
import { ClaudeExtras } from "src/sections/admin/llm-stats/widgets/claude-extras";
import { HonestyBanner } from "src/sections/admin/llm-stats/widgets/honesty-banner";
import { ActivityHeatmap } from "src/sections/admin/llm-stats/widgets/activity-heatmap";
import { ModelSplitChart } from "src/sections/admin/llm-stats/widgets/model-split-chart";
import { TopProjectsChart } from "src/sections/admin/llm-stats/widgets/top-projects-chart";
import { HarnessSplitChart } from "src/sections/admin/llm-stats/widgets/harness-split-chart";

export function AdminLlmStatsView() {
  const { stats, pushedAt, statsLoading, statsError } = useGetLlmStats();
  const state = renderState(statsError, statsLoading, stats);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 1 }}>
        Статистика LLM
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
        {pushedAt
          ? `Снапшот от ${new Date(pushedAt).toLocaleString("ru-RU")}`
          : ""}
      </Typography>
      {state === "error" && (
        <Typography sx={{ color: "text.secondary" }}>
          Не удалось загрузить статистику.
        </Typography>
      )}
      {state === "loading" && <Typography>Загрузка…</Typography>}
      {state === "empty" && (
        <Typography sx={{ color: "text.secondary" }}>
          Снапшот ещё не загружен. Запусти на локальной машине{" "}
          <code>npm run llm-stats:push</code> — он соберёт статистику из
          ~/.claude и др. и отправит её сюда.
        </Typography>
      )}
      {state === "ready" && stats && (
        <Stack spacing={3}>
          <HonestyBanner stats={stats} />
          <KpiRow stats={stats} />
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <ModelSplitChart stats={stats} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <HarnessSplitChart stats={stats} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TrendChart stats={stats} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ActivityHeatmap stats={stats} />
            </Grid>
            {stats.byProject.length > 0 && (
              <Grid size={{ xs: 12, md: 6 }}>
                <TopProjectsChart stats={stats} />
              </Grid>
            )}
            <Grid size={{ xs: 12, md: stats.byProject.length > 0 ? 6 : 12 }}>
              <ModelTable stats={stats} />
            </Grid>
          </Grid>
          <ClaudeExtras stats={stats} />
        </Stack>
      )}
    </Container>
  );
}
