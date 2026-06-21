import type { ReactNode } from "react";
import type { ApexOptions } from "apexcharts";
import type { BoxProps } from "@mui/material/Box";
import type { StackProps } from "@mui/material/Stack";
import type { Theme, SxProps } from "@mui/material/styles";
import type { ButtonBaseProps } from "@mui/material/ButtonBase";
import type { Props as ReactApexChartProps } from "react-apexcharts";

// ----------------------------------------------------------------------

export interface ChartLegendsProps extends StackProps {
  labels?: string[];
  colors?: string[];
  values?: Array<string | number>;
  sublabels?: Array<string | number>;
  icons?: ReactNode[];
}

// ----------------------------------------------------------------------

export interface ChartLoadingProps extends BoxProps {
  sx?: SxProps<Theme>;
  type?: string;
}

// ----------------------------------------------------------------------

export interface ChartSelectProps
  extends Omit<ButtonBaseProps, "value" | "onChange"> {
  options: string[];
  value: string;
  onChange: (option: string) => void;
  slotProps?: {
    button?: SxProps<Theme>;
    popover?: SxProps<Theme>;
  };
}

// ----------------------------------------------------------------------

export interface ChartLoadingConfig {
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

export interface ApexChartProps {
  type?: ReactApexChartProps["type"];
  series?: ReactApexChartProps["series"];
  options?: ApexOptions;
  width?: ReactApexChartProps["width"];
  height?: ReactApexChartProps["height"];
  loading?: ChartLoadingConfig;
}

export interface ChartProps extends Omit<BoxProps, "children"> {
  sx?: SxProps<Theme>;
  type: NonNullable<ReactApexChartProps["type"]>;
  series?: ReactApexChartProps["series"];
  height?: BoxProps["height"];
  width?: BoxProps["width"];
  options?: ApexOptions;
  loadingProps?: ChartLoadingConfig;
}
