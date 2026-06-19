import type { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiBreadcrumbs = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    ol: ({ theme }: { theme: Theme }) => ({
      rowGap: theme.spacing(0.5),
      columnGap: theme.spacing(2),
    }),

    li: ({ theme }: { theme: Theme }) => ({
      display: "inline-flex",
      "& > *": { ...theme.typography.body2 },
    }),
    separator: { margin: 0 },
  },
};

// ----------------------------------------------------------------------

export const breadcrumbs = { MuiBreadcrumbs };
