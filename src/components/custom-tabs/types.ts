import type Tabs from "@mui/material/Tabs";
import type { Theme, SxProps } from "@mui/material/styles";
import type { ReactNode, ComponentPropsWithoutRef } from "react";

// ----------------------------------------------------------------------

export interface CustomTabsProps extends ComponentPropsWithoutRef<typeof Tabs> {
  children?: ReactNode;
  slotProps?: {
    scroller?: object;
    flexContainer?: object;
    scrollButtons?: object;
    indicator?: object;
    tab?: object;
    selected?: object;
  };
  sx?: SxProps<Theme>;
}
