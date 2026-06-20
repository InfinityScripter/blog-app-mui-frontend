import type { ReactNode } from "react";
import type { SystemStyleObject } from "@mui/system";
import type { Theme, SxProps } from "@mui/material/styles";
import type { Props as SimpleBarProps } from "simplebar-react";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import SimpleBar from "simplebar-react";

import { scrollbarClasses } from "./classes";

// ----------------------------------------------------------------------

export interface ScrollbarSlotProps {
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

export const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(
  (
    {
      slotProps,
      children,
      fillContent,
      // Destructured to keep it out of the `...other` DOM spread; not used here.
      naturalScroll: _naturalScroll,
      sx,
      ...other
    },
    ref,
  ) => (
    <Box
      component={SimpleBar}
      scrollableNodeProps={{ ref }}
      clickOnTrack={false}
      className={scrollbarClasses.root}
      sx={{
        minWidth: 0,
        minHeight: 0,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        "& .simplebar-wrapper": slotProps?.wrapper,
        "& .simplebar-content-wrapper": slotProps?.contentWrapper,
        "& .simplebar-content": {
          ...(fillContent && {
            minHeight: 1,
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
          }),

          ...slotProps?.content,
        },
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  ),
);
