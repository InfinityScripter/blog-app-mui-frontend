import type { ApexOptions } from "apexcharts";
import type { Theme } from "@mui/material/styles";

import { buildPlotOptions } from "./use-chart-plot-options";
import { buildResponsive, buildChartLabels } from "./use-chart-base";

// ----------------------------------------------------------------------

type ChartOptions = ApexOptions & { responsive?: ApexOptions["responsive"] };

// ----------------------------------------------------------------------

export function buildChartOptions(
  theme: Theme,
  options?: ChartOptions,
): ApexOptions {
  const { palette } = theme.vars;
  const { divider } = palette;
  const textPrimary = palette.text.primary;
  const textDisabled = palette.text.disabled;
  const backgroundPaper = palette.background.paper;
  const grey500Channel = palette.grey["500Channel"];

  const { total: LABEL_TOTAL, value: LABEL_VALUE } = buildChartLabels(theme);

  return {
    ...options,

    /** **************************************
     * Chart
     *************************************** */
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      parentHeightOffset: 0,
      fontFamily: theme.typography.fontFamily,
      foreColor: textDisabled,
      ...options?.chart,
      animations: {
        enabled: true,
        speed: 360,
        animateGradually: { enabled: true, delay: 120 },
        dynamicAnimation: { enabled: true, speed: 360 },
        ...options?.chart?.animations,
      },
    },

    /** **************************************
     * Colors
     *************************************** */
    colors: options?.colors ?? [
      palette.primary.main,
      palette.warning.main,
      palette.info.main,
      palette.error.main,
      palette.success.main,
      palette.warning.dark,
      palette.success.darker,
      palette.info.dark,
      palette.info.darker,
    ],

    /** **************************************
     * States
     *************************************** */
    states: {
      ...options?.states,
      hover: {
        ...options?.states?.hover,
        filter: {
          type: "darken",
          ...options?.states?.hover?.filter,
        },
      },
      active: {
        ...options?.states?.active,
        filter: {
          type: "darken",
          ...options?.states?.active?.filter,
        },
      },
    },

    /** **************************************
     * Fill
     *************************************** */
    fill: {
      opacity: 1,
      ...options?.fill,
      gradient: {
        type: "vertical",
        shadeIntensity: 0,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 100],
        ...options?.fill?.gradient,
      },
    },

    /** **************************************
     * Data labels
     *************************************** */
    dataLabels: {
      enabled: false,
      ...options?.dataLabels,
    },

    /** **************************************
     * Stroke
     *************************************** */
    stroke: {
      width: 2.5,
      curve: "smooth",
      lineCap: "round",
      ...options?.stroke,
    },

    /** **************************************
     * Grid
     *************************************** */
    grid: {
      strokeDashArray: 3,
      borderColor: divider,
      ...options?.grid,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        ...options?.grid?.padding,
      },
      xaxis: {
        lines: {
          show: false,
        },
        ...options?.grid?.xaxis,
      },
    },

    /** **************************************
     * Axis
     *************************************** */
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      ...options?.xaxis,
    },
    yaxis: {
      tickAmount: 5,
      ...options?.yaxis,
    },

    /** **************************************
     * Markers
     *************************************** */
    markers: {
      size: 0,
      strokeColors: backgroundPaper,
      ...options?.markers,
    },

    /** **************************************
     * Tooltip
     *************************************** */
    tooltip: {
      theme: "false",
      fillSeriesColor: false,
      x: {
        show: true,
      },
      ...options?.tooltip,
    },

    /** **************************************
     * Legend
     *************************************** */
    legend: {
      show: false,
      position: "top",
      fontWeight: 500,
      fontSize: "13px",
      horizontalAlign: "right",
      markers: { size: 12 },
      labels: {
        colors: textPrimary,
      },
      ...options?.legend,
      itemMargin: {
        horizontal: 8,
        vertical: 8,
        ...options?.legend?.itemMargin,
      },
    },

    /** **************************************
     * plotOptions
     *************************************** */
    plotOptions: buildPlotOptions(options, {
      divider,
      grey500Channel,
      labels: { value: LABEL_VALUE, total: LABEL_TOTAL },
    }),

    /** **************************************
     * Responsive
     *************************************** */
    responsive: buildResponsive(theme, options),
  };
}
