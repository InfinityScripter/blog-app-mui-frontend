import type { Theme } from "@mui/material/styles";
import type { TabsProps } from "@mui/material/Tabs";

import { tabClasses } from "@mui/material/Tab";

import { type ThemeWithVars } from "./types";

// ----------------------------------------------------------------------

const MuiTabs = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: {
    textColor: "inherit",
    variant: "scrollable",
    allowScrollButtonsMobile: true,
  },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    flexContainer: ({
      ownerState,
      theme,
    }: {
      ownerState: TabsProps;
      theme: Theme;
    }) => ({
      ...(ownerState.variant !== "fullWidth" && {
        gap: "24px",
        [theme.breakpoints.up("sm")]: {
          gap: "40px",
        },
      }),
    }),
    indicator: { backgroundColor: "currentColor" },
  },
};

// ----------------------------------------------------------------------

const MuiTab = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { disableRipple: true, iconPosition: "start" },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: ThemeWithVars }) => ({
      opacity: 1,
      minWidth: 48,
      minHeight: 48,
      padding: theme.spacing(1, 0),
      color: theme.vars.palette.text.secondary,
      // One weight for every state on purpose: bumping it on `.selected`
      // re-measured the label and nudged each following tab a pixel sideways
      // on every switch. Selection reads through colour + the indicator.
      fontWeight: theme.typography.fontWeightSemiBold,
      lineHeight: theme.typography.body2.lineHeight,
      [`&.${tabClasses.selected}`]: {
        color: theme.vars.palette.text.primary,
      },
    }),
  },
};

// ----------------------------------------------------------------------

export const tabs = { MuiTabs, MuiTab };
