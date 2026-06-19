import type { Theme } from "@mui/material/styles";

import { varAlpha } from "../../styles";

// ----------------------------------------------------------------------

const MuiBackdrop = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({
      backgroundColor: varAlpha(theme.vars.palette.grey["800Channel"], 0.48),
    }),
    invisible: { background: "transparent" },
  },
};

// ----------------------------------------------------------------------

export const backdrop = { MuiBackdrop };
