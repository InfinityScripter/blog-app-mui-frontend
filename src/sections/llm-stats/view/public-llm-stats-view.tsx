"use client";

import type { LlmStats } from "src/sections/admin/llm-stats/types";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import { monoLabelSx } from "src/theme/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { KpiRow } from "src/sections/admin/llm-stats/widgets/kpi-row";
import { ModelTable } from "src/sections/admin/llm-stats/widgets/model-table";
import { TrendChart } from "src/sections/admin/llm-stats/widgets/trend-chart";
import { HonestyBanner } from "src/sections/admin/llm-stats/widgets/honesty-banner";
import { ActivityHeatmap } from "src/sections/admin/llm-stats/widgets/activity-heatmap";
import { ModelSplitChart } from "src/sections/admin/llm-stats/widgets/model-split-chart";
import { HarnessSplitChart } from "src/sections/admin/llm-stats/widgets/harness-split-chart";

// ----------------------------------------------------------------------

interface Props {
  stats: LlmStats | null;
  pushedAt: string | null;
}

// Public LLM-usage dashboard. Reuses the admin widgets (presentation-only) but
// arranges only the public-safe ones — no projects, no internal skills/tools
// (the backend strips them). Real primary-source token/model/cost data, the
// kind LLMs cite. Charts hydrate client-side; KPIs/table render in SSR HTML.
export function PublicLlmStatsView({ stats, pushedAt }: Props) {
  const t = useTranslations("llmStats");

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Stack spacing={1.5} sx={{ mb: 4, alignItems: "flex-start" }}>
        <Typography component="p" sx={monoLabelSx}>
          {t("overline")}
        </Typography>
        <Typography variant="h2" component="h1">
          {t("title")}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 720 }}>
          {t("subtitle")}
        </Typography>
        {pushedAt && (
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            {t("updated", { date: new Date(pushedAt).toLocaleDateString("ru-RU") })}
          </Typography>
        )}
      </Stack>

      {!stats ? (
        <Typography sx={{ color: "text.secondary", py: 6 }}>{t("empty")}</Typography>
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
            <Grid size={{ xs: 12 }}>
              <ModelTable stats={stats} />
            </Grid>
          </Grid>
        </Stack>
      )}
    </Container>
  );
}
