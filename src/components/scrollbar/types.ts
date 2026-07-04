import type { ReactNode } from "react";
import type { SystemStyleObject } from "@mui/system";
import type { Theme, SxProps } from "@mui/material/styles";
import type { Props as SimpleBarProps } from "simplebar-react";

// ----------------------------------------------------------------------

interface ScrollbarSlotProps {
  wrapper?: SystemStyleObject<Theme>;
  contentWrapper?: SystemStyleObject<Theme>;
  content?: SystemStyleObject<Theme>;
}

export interface ScrollbarProps extends Omit<SimpleBarProps, "children"> {
  children?: ReactNode;
  sx?: SxProps<Theme>;
  fillContent?: boolean;
  naturalScroll?: boolean;
  slotProps?: ScrollbarSlotProps;
}
