import type { Theme, SxProps } from "@mui/material/styles";
import type { ReactNode, ComponentPropsWithoutRef } from "react";

import NoSsr from "@mui/material/NoSsr";
import { stylesMode } from "src/theme/styles";
import { tabClasses } from "@mui/material/Tab";
import { useTheme } from "@mui/material/styles";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import { type CustomShadows } from "src/theme/core/custom-shadows";

// ----------------------------------------------------------------------

interface CustomTabsProps extends ComponentPropsWithoutRef<typeof Tabs> {
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

export function CustomTabs({
  children,
  slotProps,
  sx,
  ...other
}: CustomTabsProps) {
  const theme = useTheme<Theme & { customShadows: CustomShadows }>();

  return (
    <Tabs
      sx={{
        gap: { sm: 0 },
        minHeight: 38,
        flexShrink: 0,
        alignItems: "center",
        bgcolor: "background.neutral",
        [`& .${tabsClasses.scroller}`]: {
          p: 1,
          ...slotProps?.scroller,
        },
        [`& .${tabsClasses.flexContainer}`]: {
          gap: 0,
          ...slotProps?.flexContainer,
        },
        [`& .${tabsClasses.scrollButtons}`]: {
          borderRadius: 1,
          minHeight: "inherit",
          ...slotProps?.scrollButtons,
        },
        [`& .${tabsClasses.indicator}`]: {
          py: 1,
          height: 1,
          bgcolor: "transparent",
          "& > span": {
            width: 1,
            height: 1,
            borderRadius: 1,
            display: "block",
            bgcolor: "common.white",
            boxShadow: theme.customShadows.z1,
            [stylesMode.dark]: { bgcolor: "grey.900" },
            ...slotProps?.indicator,
          },
        },
        [`& .${tabClasses.root}`]: {
          py: 1,
          px: 2,
          zIndex: 1,
          minHeight: "auto",
          ...slotProps?.tab,
          [`&.${tabClasses.selected}`]: {
            ...slotProps?.selected,
          },
        },
        ...sx,
      }}
      {...other}
      TabIndicatorProps={{
        children: (
          <NoSsr>
            <span />
          </NoSsr>
        ),
      }}
    >
      {children}
    </Tabs>
  );
}
