"use client";

import type { LlmStats } from "src/sections/admin/llm-stats/types";

import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { DAYS } from "src/sections/admin/llm-stats/const";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function ActivityHeatmap({ stats }: { stats: LlmStats }) {
  const byCell = new Map<string, number>();
  stats.heatmap.forEach((c) => byCell.set(`${c.weekday}:${c.hour}`, c.tokens));
  const series = DAYS.map((name, weekday) => ({
    name,
    data: Array.from({ length: 24 }, (_, hour) => ({
      x: String(hour),
      y: byCell.get(`${weekday}:${hour}`) ?? 0,
    })),
  }));
  return (
    <Card>
      <CardHeader title="Активность по часам" />
      <Box sx={{ p: 3 }}>
        <Chart
          type="heatmap"
          series={series}
          options={{
            dataLabels: { enabled: false },
            xaxis: { type: "category" },
          }}
          height={360}
        />
      </Box>
    </Card>
  );
}
