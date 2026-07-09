"use client";

import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";

import type { MetricsHistoryPoint } from "../types";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Динамика CPU/RAM, накопленная с момента открытия страницы (клиентская
// история поверх 15-секундного поллинга; сервер историю не хранит).
export function HistoryChart({ history }: { history: MetricsHistoryPoint[] }) {
  const categories = history.map((point) =>
    new Date(point.at).toLocaleTimeString("ru-RU"),
  );
  const series = [
    { name: "CPU, %", data: history.map((point) => point.cpuPercent) },
    { name: "RAM, %", data: history.map((point) => point.memPercent) },
  ];

  return (
    <Card>
      <CardHeader
        title="Динамика"
        subheader="CPU и RAM с момента открытия страницы, точка каждые 15 с"
      />
      <Box sx={{ p: 3, pt: 1 }}>
        {history.length < 2 ? (
          <Typography variant="body2" sx={{ color: "text.secondary", py: 4 }}>
            Собираю историю — график появится после пары обновлений.
          </Typography>
        ) : (
          <Chart
            type="area"
            series={series}
            options={{
              xaxis: { categories, tickAmount: 6 },
              yaxis: {
                min: 0,
                max: 100,
                labels: { formatter: (v) => `${v}%` },
              },
              dataLabels: { enabled: false },
              stroke: { curve: "smooth", width: 2 },
              fill: { opacity: 0.16 },
            }}
            height={280}
          />
        )}
      </Box>
    </Card>
  );
}
