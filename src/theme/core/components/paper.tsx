import type { Theme } from "@mui/material/styles";

import { varAlpha } from "../../styles";

// ----------------------------------------------------------------------

const MuiPaper = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { elevation: 0 },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: { backgroundImage: "none" },
    outlined: ({ theme }: { theme: Theme }) => ({
      borderColor: varAlpha(theme.vars.palette.grey["500Channel"], 0.16),
    }),
  },
};

// ----------------------------------------------------------------------

export const paper = { MuiPaper };
