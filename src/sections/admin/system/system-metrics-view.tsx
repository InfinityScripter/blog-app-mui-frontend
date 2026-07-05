"use client";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import { useAuthContext } from "src/auth/hooks";
import { Iconify } from "src/components/iconify";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useGetSystemMetrics } from "src/actions/system-metrics";

import { InfoCard } from "./widgets/info-card";
import { HistoryChart } from "./widgets/history-chart";
import { UsageGaugeCard } from "./widgets/usage-gauge-card";
import { useMetricsHistory } from "./hooks/use-metrics-history";
import {
  formatClock,
  renderState,
  buildCpuDetails,
  buildSystemRows,
  buildProcessRows,
  buildDiskDetails,
  buildDatabaseRows,
  buildMemoryDetails,
} from "./utils";

export function AdminSystemMetricsView() {
  const { authenticated } = useAuthContext();
  const { metrics, metricsLoading, metricsError, metricsMutate } =
    useGetSystemMetrics(authenticated);
  const history = useMetricsHistory(metrics);
  const state = renderState(metricsError, metricsLoading, metrics);

  return (
    <Container maxWidth="xl">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <Typography variant="h4">Сервер</Typography>
        <IconButton
          onClick={() => metricsMutate()}
          aria-label="Обновить метрики"
        >
          <Iconify icon="solar:refresh-bold" />
        </IconButton>
      </Stack>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
        {metrics
          ? `${metrics.host.hostname} · ${metrics.host.distro ?? metrics.host.platform} · обновлено ${formatClock(metrics.host.timestamp)}`
          : "Живые метрики VDS"}
        {" · автообновление каждые 15 с"}
      </Typography>

      {state === "error" && (
        <Typography sx={{ color: "text.secondary" }}>
          Не удалось загрузить метрики сервера.
        </Typography>
      )}
      {state === "loading" && <Typography>Загрузка…</Typography>}
      {state === "ready" && metrics && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <UsageGaugeCard
              title="CPU"
              percent={metrics.cpu.usagePercent}
              details={buildCpuDetails(metrics)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <UsageGaugeCard
              title="Память"
              percent={metrics.memory.usedPercent}
              details={buildMemoryDetails(metrics)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            {metrics.disk ? (
              <UsageGaugeCard
                title={`Диск ${metrics.disk.mount}`}
                percent={metrics.disk.usedPercent}
                details={buildDiskDetails(metrics)}
              />
            ) : (
              <InfoCard
                title="Диск"
                rows={[{ label: "Статус", value: "недоступен" }]}
              />
            )}
          </Grid>

          <Grid size={{ xs: 12 }}>
            <HistoryChart history={history} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <InfoCard title="Система" rows={buildSystemRows(metrics)} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <InfoCard title="Процесс Node" rows={buildProcessRows(metrics)} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <InfoCard title="База данных" rows={buildDatabaseRows(metrics)} />
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
