import type { ReactNode } from "react";
import type { BoxProps } from "@mui/material/Box";
import type { Theme, SxProps } from "@mui/material/styles";

// ----------------------------------------------------------------------

export type CarouselAxis = "x" | "y";

export interface StyledRootProps {
  axis: CarouselAxis;
}

export interface StyledContainerProps extends StyledRootProps {
  slideSpacing: string;
}

export interface CarouselOptions {
  axis?: CarouselAxis;
  direction?: "ltr" | "rtl";
  slideSpacing?: string;
  parallax?: number | boolean;
  slidesToShow?: number | string | Record<string, number | string>;
}

export interface CarouselState {
  mainRef: BoxProps["ref"];
  options?: CarouselOptions;
  pluginNames?: string[];
}

export interface CarouselSlotProps {
  slide?: SxProps<Theme>;
  container?: SxProps<Theme>;
  disableMask?: boolean;
  prevBtn?: {
    svgIcon?: ReactNode;
    svgSize?: number;
    sx?: SxProps<Theme>;
  };
  nextBtn?: {
    svgIcon?: ReactNode;
    svgSize?: number;
    sx?: SxProps<Theme>;
  };
  dot?: {
    size?: number;
    sx?: SxProps<Theme>;
    selected?: SxProps<Theme>;
  };
}

export interface CarouselProps extends Omit<BoxProps, "children"> {
  carousel: CarouselState;
  children?: ReactNode;
  sx?: SxProps<Theme>;
  slotProps?: CarouselSlotProps;
}
