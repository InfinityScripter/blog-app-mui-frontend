import type { BoxProps } from "@mui/material/Box";
import type { IconifyIconProps } from "@iconify/react";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { Theme, SxProps } from "@mui/material/styles";

// ----------------------------------------------------------------------

export interface IconifyProps
  extends Omit<
    IconifyIconProps,
    "icon" | "width" | "height" | "color" | "onLoad"
  > {
  className?: string;
  width?: number | string;
  sx?: SxProps<Theme>;
  icon: string;
}

// ----------------------------------------------------------------------

export interface FlagIconProps
  extends Omit<BoxProps, "children" | "component"> {
  code?: string;
  sx?: SxProps<Theme>;
}

// ----------------------------------------------------------------------

export interface SocialIconProps extends Omit<SvgIconProps, "width"> {
  icon?: string;
  width?: number | string;
}
