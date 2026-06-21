import type { ReactNode } from "react";
import type { BoxProps } from "@mui/material/Box";
import type { AvatarProps } from "@mui/material/Avatar";
import type { Variants, Transition } from "framer-motion";
import type { Theme, SxProps } from "@mui/material/styles";
import type { TypographyProps } from "@mui/material/Typography";

// ----------------------------------------------------------------------

export interface AnimateAvatarProps extends Omit<BoxProps, "sx"> {
  sx?: SxProps<Theme>;
  slotProps?: {
    avatar?: Partial<AvatarProps>;
    overlay?: {
      border?: number;
      spacing?: number;
      color?: string;
    };
    animate?: {
      transition?: Record<string, unknown>;
    };
  };
  children?: ReactNode;
  width?: number | string;
}

// ----------------------------------------------------------------------

export interface AnimateBorderProps {
  animate?: {
    disable?: boolean;
    delay?: number;
    loop?: boolean;
    angle?: number;
    length?: number;
    width?: string;
    color?: string | string[];
    ease?: Transition["ease"];
    duration?: number;
    distance?: number;
    repeatType?: Transition["repeatType"];
    disableDoubleline?: boolean;
    outline?: string;
  };
  sx?: SxProps<Theme>;
}

// ----------------------------------------------------------------------

export interface AnimateCountUpProps extends Omit<TypographyProps, "children"> {
  to: number;
  from?: number;
  unit?: string;
  toFixed?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
  sx?: SxProps<Theme>;
}

// ----------------------------------------------------------------------

export interface AnimateLogo1Props extends Omit<BoxProps, "sx"> {
  logo?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export interface AnimateLogo2Props extends Omit<BoxProps, "sx"> {
  logo?: React.ReactNode;
  sx?: SxProps<Theme>;
}

// ----------------------------------------------------------------------

export interface AnimateTextProps extends Omit<TypographyProps, "children"> {
  text: string | string[];
  variants?: Variants;
  once?: boolean;
  amount?: number;
  repeatDelay?: number;
  sx?: SxProps<Theme>;
}

// ----------------------------------------------------------------------

export interface MotionContainerProps extends Omit<BoxProps, "component"> {
  animate?: boolean;
  action?: boolean;
  children?: ReactNode;
}

// ----------------------------------------------------------------------

export interface MotionLazyProps {
  children?: ReactNode;
}

// ----------------------------------------------------------------------

export interface MotionViewportProps extends Omit<BoxProps, "component"> {
  children?: ReactNode;
  disableAnimate?: boolean;
}
