import dynamic from "next/dynamic";

import { ChartLoading } from "./chart-loading";
import { withLoadingProps } from "../../utils/with-loading-props";

import type { ApexChartProps } from "./types";

// ----------------------------------------------------------------------

export const ApexChart = withLoadingProps<ApexChartProps>((props) =>
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
