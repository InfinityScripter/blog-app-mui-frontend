import type { ApexOptions } from "apexcharts";
import type { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

type ChartOptions = ApexOptions & { responsive?: ApexOptions["responsive"] };

// ApexCharts types `fontSize` as `string`, while MUI typography exposes it as
// `string | number | undefined` — normalize to a CSS string here.
function toFontSize(size: string | number | undefined): string {
  return typeof size === "number" ? `${size}px` : (size ?? "");
}

// ----------------------------------------------------------------------

export function buildChartLabels(theme: Theme) {
  const textPrimary = theme.vars.palette.text.primary;
  const textSecondary = theme.vars.palette.text.secondary;

  const total = {
    show: true,
    label: "Total",
    color: textSecondary,
    fontSize: toFontSize(theme.typography.subtitle2.fontSize),
    fontWeight: theme.typography.subtitle2.fontWeight,
  };

  const value = {
    offsetY: 8,
    color: textPrimary,
    fontSize: toFontSize(theme.typography.h4.fontSize),
    fontWeight: theme.typography.h4.fontWeight,
  };

  return { total, value };
}

// ----------------------------------------------------------------------

export function buildResponsive(theme: Theme, options?: ChartOptions) {
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

  return RESPONSIVE.reduce<NonNullable<ApexOptions["responsive"]>>(
    (acc, cur) => {
      if (!acc.some((item) => item.breakpoint === cur.breakpoint)) {
        acc.push(cur);
      }
      return acc;
    },
    [],
  );
}
