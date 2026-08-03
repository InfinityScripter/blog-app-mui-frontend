"use client";

import type { FinanceMonth } from "src/types/finance";

import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { fRub, ymLabel, fRubShort } from "src/sections/finance/utils";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function FinanceMonthlyChart({ months }: { months: FinanceMonth[] }) {
  const categories = months.map((month) => ymLabel(month.ym));
  const series = [
    {
      name: "Расходы",
      type: "column",
      data: months.map((month) => Math.round(month.expense)),
    },
    {
      name: "Доходы",
      type: "line",
      data: months.map((month) => Math.round(month.income)),
    },
  ];

  return (
    <Card>
      <CardHeader
        title="Доходы и расходы по месяцам"
        subheader="Вся загруженная история для контекста — выбранный период влияет на карточки и категории. Внутренние переводы уже исключены."
      />
      <Box sx={{ p: 3 }}>
        <Chart
          type="line"
          series={series}
          height={340}
          options={{
            stroke: { width: [0, 3], curve: "smooth" },
            plotOptions: { bar: { columnWidth: "55%", borderRadius: 3 } },
            dataLabels: { enabled: false },
            xaxis: { categories },
            yaxis: {
              labels: { formatter: (value: number) => fRubShort(value) },
            },
            tooltip: { y: { formatter: (value: number) => fRub(value) } },
            legend: { position: "top", horizontalAlign: "right" },
          }}
        />
      </Box>
    </Card>
  );
}
