import type { ApexOptions } from "apexcharts";

import { varAlpha } from "src/theme/styles";
import { useTheme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export function useChart(
  options?: ApexOptions & { responsive?: ApexOptions["responsive"] },
) {
  const theme = useTheme();
  const successPalette = theme.palette
    .success as typeof theme.palette.success & {
    darker?: string;
  };
  const infoPalette = theme.palette.info as typeof theme.palette.info & {
    darker?: string;
  };
  const greyVars = theme.vars?.palette.grey as
    | Record<string, string>
    | undefined;
  const textVars = theme.vars?.palette.text;
  const backgroundVars = theme.vars?.palette.background as
    | Record<string, string>
    | undefined;
  const divider = theme.vars?.palette.divider ?? theme.palette.divider;
  const textPrimary = textVars?.primary ?? theme.palette.text.primary;
  const textSecondary = textVars?.secondary ?? theme.palette.text.secondary;
  const textDisabled = textVars?.disabled ?? theme.palette.text.disabled;
  const backgroundPaper =
    backgroundVars?.paper ?? theme.palette.background.paper;
  const grey500Channel =
    greyVars?.["500Channel"] ?? theme.palette.grey[500] ?? "145 158 171";

  const LABEL_TOTAL = {
    show: true,
    label: "Total",
    color: textSecondary,
    fontSize: theme.typography.subtitle2.fontSize,
    fontWeight: theme.typography.subtitle2.fontWeight,
  };

  const LABEL_VALUE = {
    offsetY: 8,
    color: textPrimary,
    fontSize: theme.typography.h4.fontSize,
    fontWeight: theme.typography.h4.fontWeight,
  };

  const RESPONSIVE = [
    {
      breakpoint: theme.breakpoints.values.sm, // sm ~ 600
      options: {
        plotOptions: {
          bar: {
            borderRadius: 3,
            columnWidth: "80%",
          },
        },
      },
    },
    {
      breakpoint: theme.breakpoints.values.md, // md ~ 900
      options: {
        plotOptions: {
          bar: {
            columnWidth: "60%",
          },
        },
      },
    },
    ...(options?.responsive ?? []),
  ];

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
      theme.palette.primary.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.error.main,
      theme.palette.success.main,
      theme.palette.warning.dark,
      successPalette.darker ?? theme.palette.success.dark,
      theme.palette.info.dark,
      infoPalette.darker ?? theme.palette.info.dark,
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
          value: 0.88,
          ...options?.states?.hover?.filter,
        },
      },
      active: {
        ...options?.states?.active,
        filter: {
          type: "darken",
          value: 0.88,
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
      markers: { radius: 12 },
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
    plotOptions: {
      ...options?.plotOptions,
      // plotOptions: Bar
      bar: {
        borderRadius: 4,
        columnWidth: "48%",
        borderRadiusApplication: "end",
        ...options?.plotOptions?.bar,
      },

      // plotOptions: Pie + Donut
      pie: {
        ...options?.plotOptions?.pie,
        donut: {
          ...options?.plotOptions?.pie?.donut,
          labels: {
            show: true,
            ...options?.plotOptions?.pie?.donut?.labels,
            value: {
              ...LABEL_VALUE,
              ...options?.plotOptions?.pie?.donut?.labels?.value,
            },
            total: {
              ...LABEL_TOTAL,
              ...options?.plotOptions?.pie?.donut?.labels?.total,
            },
          },
        },
      },

      // plotOptions: Radialbar
      radialBar: {
        ...options?.plotOptions?.radialBar,
        hollow: {
          margin: -8,
          size: "100%",
          ...options?.plotOptions?.radialBar?.hollow,
        },
        track: {
          margin: -8,
          strokeWidth: "50%",
          background: varAlpha(grey500Channel, 0.16),
          ...options?.plotOptions?.radialBar?.track,
        },
        dataLabels: {
          ...options?.plotOptions?.radialBar?.dataLabels,
          value: {
            ...LABEL_VALUE,
            ...options?.plotOptions?.radialBar?.dataLabels?.value,
          },
          total: {
            ...LABEL_TOTAL,
            ...options?.plotOptions?.radialBar?.dataLabels?.total,
          },
        },
      },

      // plotOptions: Radar
      radar: {
        ...options?.plotOptions?.radar,
        polygons: {
          fill: {
            colors: ["transparent"],
          },
          strokeColors: divider,
          connectorColors: divider,
          ...options?.plotOptions?.radar?.polygons,
        },
      },

      // plotOptions: polarArea
      polarArea: {
        rings: {
          strokeColor: divider,
        },
        spokes: {
          connectorColors: divider,
        },
        ...options?.plotOptions?.polarArea,
      },

      // plotOptions: heatmap
      heatmap: {
        distributed: true,
        ...options?.plotOptions?.heatmap,
      },
    },

    /** **************************************
     * Responsive
     *************************************** */
    responsive: RESPONSIVE.reduce<NonNullable<ApexOptions["responsive"]>>(
      (acc, cur) => {
        if (!acc.some((item) => item.breakpoint === cur.breakpoint)) {
          acc.push(cur);
        }
        return acc;
      },
      [],
    ),
  };
}
