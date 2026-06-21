import type { ApexOptions } from "apexcharts";

import { varAlpha } from "src/theme/styles";

// ----------------------------------------------------------------------

interface ChartLabels {
  value: {
    offsetY: number;
    color: string;
    fontSize: string;
    fontWeight: number | string | undefined;
  };
  total: {
    show: boolean;
    label: string;
    color: string;
    fontSize: string;
    fontWeight: number | string | undefined;
  };
}

interface PlotOptionsDeps {
  divider: string;
  grey500Channel: string;
  labels: ChartLabels;
}

export function buildPlotOptions(
  options: ApexOptions | undefined,
  deps: PlotOptionsDeps,
): ApexOptions["plotOptions"] {
  const { divider, grey500Channel, labels } = deps;
  const { value: LABEL_VALUE, total: LABEL_TOTAL } = labels;

  return {
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
  };
}
