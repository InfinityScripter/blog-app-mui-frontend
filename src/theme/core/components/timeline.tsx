import type { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiTimelineDot = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: { root: { boxShadow: "none" } },
};

const MuiTimelineConnector = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({
      backgroundColor: theme.vars.palette.divider,
    }),
  },
};

// ----------------------------------------------------------------------

export const timeline = { MuiTimelineDot, MuiTimelineConnector };
