import type { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiTypography = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    paragraph: ({ theme }: { theme: Theme }) => ({
      marginBottom: theme.spacing(2),
    }),
    gutterBottom: ({ theme }: { theme: Theme }) => ({
      marginBottom: theme.spacing(1),
    }),
  },
};

// ----------------------------------------------------------------------

export const typography = { MuiTypography };
