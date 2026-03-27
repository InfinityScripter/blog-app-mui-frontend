import type { ApexOptions } from "apexcharts";
import type { BoxProps } from "@mui/material/Box";
import type { Theme, SxProps } from "@mui/material/styles";
import type { Props as ReactApexChartProps } from "react-apexcharts";

import dynamic from "next/dynamic";
import Box from "@mui/material/Box";

import { ChartLoading } from "./chart-loading";
import { withLoadingProps } from "../../utils/with-loading-props";

interface ChartLoadingConfig {
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

interface ApexChartProps {
  type?: ReactApexChartProps["type"];
  series?: ReactApexChartProps["series"];
  options?: ApexOptions;
  width?: ReactApexChartProps["width"];
  height?: ReactApexChartProps["height"];
  loading?: ChartLoadingConfig;
}

const ApexChart = withLoadingProps<ApexChartProps>((props) =>
  dynamic(() => import("react-apexcharts").then((mod) => mod.default), {
    ssr: false,
    loading: () => {
      const { loading, type } = props();

      return loading?.disabled ? null : (
        <ChartLoading type={type} sx={loading?.sx} />
      );
    },
  }),
);

// ----------------------------------------------------------------------

interface ChartProps extends BoxProps {
  sx?: SxProps<Theme>;
  type: NonNullable<ReactApexChartProps["type"]>;
  series?: ReactApexChartProps["series"];
  height?: number | string;
  width?: number | string;
  options?: ApexOptions;
  loadingProps?: ChartLoadingConfig;
}

export function Chart({
  sx,
  type,
  series,
  height,
  options,
  loadingProps,
  width = "100%",
  ...other
}: ChartProps) {
  return (
    <Box
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
  );
}
