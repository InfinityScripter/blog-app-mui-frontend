import type { ReactNode } from "react";
import type { PopoverProps } from "@mui/material/Popover";
import type { Theme, SxProps } from "@mui/material/styles";

import Popover from "@mui/material/Popover";
import { listClasses } from "@mui/material/List";
import { menuItemClasses } from "@mui/material/MenuItem";

import { StyledArrow } from "./styles";
import { type ArrowPlacement, calculateAnchorOrigin } from "./utils";

// ----------------------------------------------------------------------

interface CustomPopoverProps extends Omit<PopoverProps, "open" | "children"> {
  open: boolean;
  children?: ReactNode;
  slotProps?: {
    paper?: {
      sx?: SxProps<Theme>;
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

export function CustomPopover({
  open,
  onClose,
  children,
  anchorEl,
  slotProps,
  ...other
}: CustomPopoverProps) {
  const arrowPlacement = slotProps?.arrow?.placement ?? "top-right";

  const arrowSize = slotProps?.arrow?.size ?? 14;

  const arrowOffset = slotProps?.arrow?.offset ?? 17;

  const { paperStyles, anchorOrigin, transformOrigin } =
    calculateAnchorOrigin(arrowPlacement);

  return (
    <Popover
      open={!!open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      slotProps={{
        ...slotProps,
        paper: {
          ...slotProps?.paper,
          sx: {
            overflow: "inherit",
            [`& .${listClasses.root}`]: { minWidth: 140 },
            [`& .${menuItemClasses.root}`]: { gap: 2 },
            ...(paperStyles as SxProps<Theme>),
            ...(slotProps?.paper?.sx as SxProps<Theme>),
          } as SxProps<Theme>,
        },
      }}
      {...other}
    >
      {!slotProps?.arrow?.hide && (
        <StyledArrow
          sx={slotProps?.arrow?.sx}
          placement={arrowPlacement}
          offset={arrowOffset}
          size={arrowSize}
        />
      )}

      {children}
    </Popover>
  );
}
