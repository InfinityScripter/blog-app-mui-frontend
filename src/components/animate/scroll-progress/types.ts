import type { MotionValue } from "framer-motion";
import type { BoxProps } from "@mui/material/Box";
import type { Theme, SxProps } from "@mui/material/styles";

// ----------------------------------------------------------------------

export type ScrollProgressColor =
  | "inherit"
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "error";

export interface ScrollProgressProps extends Omit<BoxProps, "color"> {
  size?: number;
  variant?: "circular" | "linear";
  progress?: MotionValue<number> | number;
  thickness?: number;
  color?: ScrollProgressColor;
  sx?: SxProps<Theme>;
}

export interface ScrollProgressCircularProps extends Omit<BoxProps, "color"> {
  progressSize: number;
  thickness: number;
  color: ScrollProgressColor;
  progressValue: MotionValue<number>;
  sx?: SxProps<Theme>;
}

export interface ScrollProgressLinearProps extends Omit<BoxProps, "color"> {
  progressSize: number;
  color: ScrollProgressColor;
  scaleX: MotionValue<number>;
  sx?: SxProps<Theme>;
}
