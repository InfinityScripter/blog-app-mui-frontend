"use client";

import type { LlmStats } from "src/sections/admin/llm-stats/types";

import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function TopProjectsChart({ stats }: { stats: LlmStats }) {
  const rows = stats.byProject.slice(0, 10);
  const categories = rows.map((r) => r.project);
  const series = [{ name: "Токены", data: rows.map((r) => r.tokens) }];
  return (
    <Card sx={{ height: 1 }}>
      <CardHeader title="Топ проекты" />
      <Box sx={{ p: 3 }}>
        <Chart
          type="bar"
          series={series}
          options={{
            plotOptions: { bar: { horizontal: true } },
            xaxis: { categories },
          }}
          height={360}
        />
      </Box>
    </Card>
  );
}
