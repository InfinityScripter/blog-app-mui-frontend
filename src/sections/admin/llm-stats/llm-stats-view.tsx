"use client";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useGetLlmStats } from "src/actions/llm-stats";
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
  const { stats, statsLoading, statsError } = useGetLlmStats();

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Статистика LLM
      </Typography>
      {statsError ? (
        <Typography sx={{ color: "text.secondary" }}>
          Не удалось загрузить статистику. Данные читаются локально (~/.claude и
          др.) — на этом хосте их нет.
        </Typography>
      ) : statsLoading || !stats ? (
        <Typography>Загрузка…</Typography>
      ) : (
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
            <Grid size={{ xs: 12, md: 6 }}>
              <TopProjectsChart stats={stats} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ModelTable stats={stats} />
            </Grid>
          </Grid>
          <ClaudeExtras stats={stats} />
        </Stack>
      )}
    </Container>
  );
}
