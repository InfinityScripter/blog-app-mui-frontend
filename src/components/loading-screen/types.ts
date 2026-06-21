import type { BoxProps } from "@mui/material/Box";
import type { Theme, SxProps } from "@mui/material/styles";

// ----------------------------------------------------------------------

export interface LoadingScreenProps extends Omit<BoxProps, "sx"> {
  portal?: boolean;
  sx?: SxProps<Theme>;
}

export interface SplashScreenProps extends Omit<BoxProps, "sx"> {
  portal?: boolean;
  sx?: SxProps<Theme>;
}
