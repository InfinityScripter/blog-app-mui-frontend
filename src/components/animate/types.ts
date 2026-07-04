import type { ReactNode } from "react";
import type { BoxProps } from "@mui/material/Box";
import type { AvatarProps } from "@mui/material/Avatar";
import type { Theme, SxProps } from "@mui/material/styles";

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

export interface AnimateLogo1Props extends Omit<BoxProps, "sx"> {
  logo?: React.ReactNode;
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
