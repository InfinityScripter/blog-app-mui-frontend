import type { Theme } from "@mui/material/styles";
import type { DialogProps } from "@mui/material/Dialog";

import { type ThemeWithVars } from "./types";

// ----------------------------------------------------------------------

const MuiDialog = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    paper: ({
      ownerState,
      theme,
    }: {
      ownerState: DialogProps;
      theme: ThemeWithVars;
    }) => ({
      boxShadow: theme.customShadows.dialog,
      borderRadius: Number(theme.shape.borderRadius) * 2,
      ...(!ownerState.fullScreen && { margin: theme.spacing(2) }),
    }),
    paperFullScreen: { borderRadius: 0 },
  },
};

const MuiDialogTitle = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({ padding: theme.spacing(3) }),
  },
};

const MuiDialogContent = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({ padding: theme.spacing(0, 3) }),
    dividers: ({ theme }: { theme: Theme }) => ({
      borderTop: 0,
      borderBottomStyle: "dashed",
      paddingBottom: theme.spacing(3),
    }),
  },
};

const MuiDialogActions = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { disableSpacing: true },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({
      padding: theme.spacing(3),
      "& > :not(:first-of-type)": { marginLeft: theme.spacing(1.5) },
    }),
  },
};

// ----------------------------------------------------------------------

export const dialog = {
  MuiDialog,
  MuiDialogTitle,
  MuiDialogContent,
  MuiDialogActions,
};
