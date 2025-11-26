import { useTheme } from "@mui/material/styles";

import { fPercent } from "src/utils/format-number";

import { Chart, useChart } from "src/components/chart";

// ----------------------------------------------------------------------

export function ProjectColumnNegative({ chart, rangeSettings }) {
  const theme = useTheme();

  // Default ranges for project data (typically within ±5%)
  const defaultRanges = [
    {
      from: -5,
      to: -0.01,
      color: theme.palette.error.main, // Red for negative deviation
    },
    {
      from: 0,
      to: 5,
      color: theme.palette.success.main, // Green for positive deviation
    },
  ];

  // Use custom ranges if provided, otherwise use defaults
  const ranges = rangeSettings || defaultRanges;

  const chartColors = chart.colors ?? [
    theme.palette.error.main,
    theme.palette.success.main,
  ];

  const chartOptions = useChart({
    stroke: { width: 0 },
    xaxis: {
      type: "datetime",
      categories: chart.categories,
    },
    yaxis: {
      min: -5,
      max: 5,
      tickAmount: 6,
      labels: { formatter: (value) => fPercent(value) },
      title: {
        text: "Отклонение (факт - план)",
        style: {
          fontSize: "12px",
          fontWeight: 500,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value}%`,
        title: { formatter: () => "Отклонение:" },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: "60%",
        colors: {
          ranges,
        },
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
      offsetY: -20,
      style: {
        fontSize: "11px",
        colors: [theme.palette.text.secondary],
      },
    },
  });

  return (
    <Chart
      type="bar"
      series={chart.series}
      options={chartOptions}
      height={300}
    />
  );
}
