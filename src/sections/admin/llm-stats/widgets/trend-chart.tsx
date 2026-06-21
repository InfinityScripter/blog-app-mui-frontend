"use client";

import type { LlmStats } from "src/sections/admin/llm-stats/types";

import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function TrendChart({ stats }: { stats: LlmStats }) {
  const categories = stats.trend.map((t) => t.dateKey);
  const series = [{ name: "Токены", data: stats.trend.map((t) => t.tokens) }];
  return (
    <Card>
      <CardHeader title="Токены по дням" />
      <Box sx={{ p: 3 }}>
        <Chart
          type="area"
          series={series}
          options={{
            xaxis: { categories },
            dataLabels: { enabled: false },
            stroke: { curve: "smooth" },
          }}
          height={320}
        />
      </Box>
    </Card>
  );
}
