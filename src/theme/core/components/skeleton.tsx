import type { Theme } from "@mui/material/styles";

import { varAlpha } from "../../styles";

// ----------------------------------------------------------------------

const MuiSkeleton = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { animation: "wave", variant: "rounded" },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({
      backgroundColor: varAlpha(theme.vars.palette.grey["400Channel"], 0.12),
    }),
    rounded: ({ theme }: { theme: Theme }) => ({
      borderRadius: Number(theme.shape.borderRadius) * 2,
    }),
  },
};

// ----------------------------------------------------------------------

export const skeleton = { MuiSkeleton };
