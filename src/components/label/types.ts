import type { ReactNode } from "react";
import type { BoxProps } from "@mui/material/Box";
import type { ColorType } from "src/theme/core/components/types";

// ----------------------------------------------------------------------

export type LabelColor = "default" | ColorType;

export type LabelVariant = "filled" | "outlined" | "soft" | "inverted";

/**
 * Internal styling state forwarded to the styled `Box` via the `ownerState`
 * prop. Drives the per-color / per-variant style branches in `styles.ts`.
 */
export interface LabelOwnerState {
  color: LabelColor;
  variant: LabelVariant;
}

export interface LabelProps extends Omit<BoxProps, "color"> {
  color?: LabelColor;
  variant?: LabelVariant;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}
