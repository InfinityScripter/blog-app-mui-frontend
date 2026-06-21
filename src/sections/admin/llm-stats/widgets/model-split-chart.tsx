"use client";

import type { LlmStats } from "src/sections/admin/llm-stats/types";

import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { FAMILY_LABEL } from "src/sections/admin/llm-stats/const";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function ModelSplitChart({ stats }: { stats: LlmStats }) {
  const labels = stats.byModelFamily.map(
    (f) => FAMILY_LABEL[f.family] ?? f.family,
  );
  const series = stats.byModelFamily.map((f) => f.tokens);
  return (
    <Card sx={{ height: 1 }}>
      <CardHeader title="Модели (доля токенов)" />
      <Box sx={{ p: 3 }}>
        <Chart
          type="donut"
          series={series}
          options={{ labels, legend: { position: "bottom" } }}
          height={320}
        />
      </Box>
    </Card>
  );
}
