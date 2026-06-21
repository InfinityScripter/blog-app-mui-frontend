import { forwardRef } from "react";
import Box from "@mui/material/Box";
import SimpleBar from "simplebar-react";

import { scrollbarClasses } from "./classes";

import type { ScrollbarProps } from "./types";

// ----------------------------------------------------------------------

export type { ScrollbarProps, ScrollbarSlotProps } from "./types";

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
