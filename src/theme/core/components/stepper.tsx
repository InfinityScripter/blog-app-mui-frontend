import type { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiStepConnector = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    line: ({ theme }: { theme: Theme }) => ({
      borderColor: theme.vars.palette.divider,
    }),
  },
};

// ----------------------------------------------------------------------

export const stepper = { MuiStepConnector };
