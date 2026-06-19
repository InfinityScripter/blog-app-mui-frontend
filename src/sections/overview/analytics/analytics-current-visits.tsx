import type { ComponentType } from "react";
import type { ApexOptions } from "apexcharts";
import type { CardProps } from "@mui/material/Card";
import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";

import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import { fNumber } from "src/utils/format-number";
import {
  useChart,
  ChartLegends,
  Chart as RawChart,
} from "src/components/chart";

// ----------------------------------------------------------------------

// The shared `Chart` types `width`/`height` as `number | string`, but at
// runtime it forwards them to a `Box`'s `sx`, which also accepts responsive
// breakpoint objects. Re-type those two props at the call site (no runtime
// change) so the responsive form type-checks without resorting to `any`.
type ResponsiveSize =
  | number
  | string
  | Partial<Record<Breakpoint, number | string>>;
const Chart = RawChart as unknown as ComponentType<{
  type: string;
  series?: number[] | { name?: string; data: number[] }[];
  options?: ApexOptions;
  width?: ResponsiveSize;
  height?: ResponsiveSize;
  sx?: SxProps<Theme>;
}>;

interface AnalyticsCurrentVisitsProps extends Omit<CardProps, "title"> {
  title?: React.ReactNode;
  subheader?: React.ReactNode;
  chart: {
    colors?: string[];
    series: { label: string; value: number }[];
    options?: ApexOptions;
  };
}

export function AnalyticsCurrentVisits({
  title,
  subheader,
  chart,
  ...other
}: AnalyticsCurrentVisitsProps) {
  const theme = useTheme();

  const chartSeries = chart.series.map((item) => item.value);

  const chartColors = chart.colors ?? [
    theme.palette.primary.main,
    theme.palette.warning.light,
    theme.palette.info.dark,
    theme.palette.error.main,
  ];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    labels: chart.series.map((item) => item.label),
    stroke: { width: 0 },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      y: {
        formatter: (value) => fNumber(value),
        title: { formatter: (seriesName) => `${seriesName}` },
      },
    },
    plotOptions: { pie: { donut: { labels: { show: false } } } },
    ...chart.options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Chart
        type="pie"
        series={chartSeries}
        options={chartOptions}
        width={{ xs: 240, xl: 260 }}
        height={{ xs: 240, xl: 260 }}
        sx={{ my: 6, mx: "auto" }}
      />

      <Divider sx={{ borderStyle: "dashed" }} />

      <ChartLegends
        labels={chartOptions?.labels}
        colors={chartOptions?.colors}
        sx={{ p: 3, justifyContent: "center" }}
      />
    </Card>
  );
}
