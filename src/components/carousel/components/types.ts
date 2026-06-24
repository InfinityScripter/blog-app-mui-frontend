import type { ReactNode } from "react";
import type { BoxProps } from "@mui/material/Box";
import type { StackProps } from "@mui/material/Stack";
import type { Theme, SxProps } from "@mui/material/styles";
import type { ButtonBaseProps } from "@mui/material/ButtonBase";

import type { CarouselOptions, CarouselSlotProps } from "../types";

// ----------------------------------------------------------------------

export interface ArrowButtonSlotProps {
  svgIcon?: ReactNode;
  svgSize?: number;
  sx?: SxProps<Theme>;
}

export interface ArrowButtonProps
  extends ArrowButtonSlotProps,
    Omit<ButtonBaseProps, "sx"> {
  options?: CarouselOptions;
  variant: "prev" | "next";
  sx?: SxProps<Theme>;
}

// ----------------------------------------------------------------------

export interface CarouselArrowButtonsProps
  extends Omit<StackProps, "slotProps"> {
  options?: CarouselOptions;
  slotProps?: Pick<CarouselSlotProps, "prevBtn" | "nextBtn">;
  onClickPrev?: () => void;
  onClickNext?: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
  sx?: SxProps<Theme>;
}

export interface CarouselArrowNumberButtonsProps
  extends CarouselArrowButtonsProps {
  totalSlides?: number;
  selectedIndex?: number;
}

// ----------------------------------------------------------------------

export interface CarouselDotButtonsProps extends Omit<BoxProps, "slotProps"> {
  sx?: SxProps<Theme>;
  gap?: number;
  slotProps?: Pick<CarouselSlotProps, "dot">;
  onClickDot: (index: number) => void;
  scrollSnaps: number[];
  selectedIndex: number;
  fallbackCount?: number;
  variant?: "circular" | "rounded" | "number";
  fallback?: boolean;
}

// ----------------------------------------------------------------------

export interface CarouselProgressBarProps extends BoxProps {
  value: number;
  sx?: SxProps<Theme>;
}

// ----------------------------------------------------------------------

export type CarouselAxis = "x" | "y";

export interface StyledRootProps {
  axis: CarouselAxis;
  slideSpacing?: string;
}

export interface SlidesToShowByBreakpoint {
  [key: string]: number | string;
}

export interface CarouselSlideOptions {
  axis?: CarouselAxis;
  slideSpacing?: string;
  parallax?: number | boolean;
  slidesToShow?: number | string | SlidesToShowByBreakpoint;
}

export interface CarouselSlideProps extends Omit<BoxProps, "children"> {
  children?: ReactNode;
  options?: CarouselSlideOptions;
  sx?: SxProps<Theme>;
}

// ----------------------------------------------------------------------

export interface CarouselThumbsProps extends Omit<BoxProps, "slotProps"> {
  children?: ReactNode;
  slotProps?: Pick<CarouselSlotProps, "slide" | "container" | "disableMask">;
  options?: CarouselOptions;
  sx?: SxProps<Theme>;
}

export interface CarouselThumbProps extends Omit<ButtonBaseProps, "children"> {
  sx?: SxProps<Theme>;
  src: string;
  index: number;
  selected?: boolean;
}
