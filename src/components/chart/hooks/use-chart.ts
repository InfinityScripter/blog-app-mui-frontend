import type { ApexOptions } from "apexcharts";

import { useTheme } from "@mui/material/styles";

import { buildChartOptions } from "./use-chart-options";

// ----------------------------------------------------------------------

export function useChart(
  options?: ApexOptions & { responsive?: ApexOptions["responsive"] },
) {
  const theme = useTheme();

  return buildChartOptions(theme, options);
}
