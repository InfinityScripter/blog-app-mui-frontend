import type { Theme } from "@mui/material/styles";

import { type ThemeWithVars } from "./types";

// ----------------------------------------------------------------------

const MuiCard = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: ThemeWithVars }) => ({
      position: "relative",
      boxShadow: theme.customShadows.card,
      borderRadius: Number(theme.shape.borderRadius) * 2,
      zIndex: 0, // Fix Safari overflow: hidden with border radius
    }),
  },
};

// ----------------------------------------------------------------------

const MuiCardHeader = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: {
    titleTypographyProps: { variant: "h6" },
    subheaderTypographyProps: { variant: "body2", marginTop: "4px" },
  },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({
      padding: theme.spacing(3, 3, 0),
    }),
  },
};

// ----------------------------------------------------------------------

const MuiCardContent = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({ padding: theme.spacing(3) }),
  },
};

// ----------------------------------------------------------------------

export const card = { MuiCard, MuiCardHeader, MuiCardContent };
