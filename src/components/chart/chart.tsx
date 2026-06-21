import { forwardRef } from "react";
import Box from "@mui/material/Box";

import { ApexChart } from "./apex-chart";

import type { ChartProps } from "./types";

// ----------------------------------------------------------------------

export type { ChartProps } from "./types";

export const Chart = forwardRef<HTMLDivElement, ChartProps>(
  (
    {
      sx,
      type,
      series,
      height,
      options,
      loadingProps,
      width = "100%",
      ...other
    },
    ref,
  ) => (
    <Box
      ref={ref}
      dir="ltr"
      sx={{
        width,
        height,
        flexShrink: 0,
        borderRadius: 1.5,
        position: "relative",
        ...sx,
      }}
      {...other}
    >
      <ApexChart
        type={type}
        series={series}
        options={options}
        width="100%"
        height="100%"
        loading={loadingProps}
      />
    </Box>
  ),
);

Chart.displayName = "Chart";
