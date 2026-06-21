import type { ReactNode } from "react";
import type { SystemStyleObject } from "@mui/system";
import type { Theme, SxProps } from "@mui/material/styles";
import type { PopoverProps, PopoverOrigin } from "@mui/material/Popover";

// ----------------------------------------------------------------------

export type ArrowPlacement =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "left-top"
  | "left-center"
  | "left-bottom"
  | "right-top"
  | "right-center"
  | "right-bottom";

export interface AnchorOriginResult {
  paperStyles?: SxProps<Theme>;
  anchorOrigin: PopoverOrigin;
  transformOrigin: PopoverOrigin;
}

export interface StyledArrowProps {
  placement: ArrowPlacement;
  offset?: number;
  size?: number;
  sx?: SxProps<Theme>;
}

export interface CustomPopoverProps
  extends Omit<PopoverProps, "open" | "children"> {
  open: boolean;
  children?: ReactNode;
  slotProps?: {
    paper?: {
      sx?: SystemStyleObject<Theme>;
    };
    arrow?: {
      hide?: boolean;
      placement?: ArrowPlacement;
      size?: number;
      offset?: number;
      sx?: SxProps<Theme>;
    };
  };
}
