import type { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiTreeItem = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    label: ({ theme }: { theme: Theme }) => ({ ...theme.typography.body2 }),
    iconContainer: { width: "auto" },
  },
};

// ----------------------------------------------------------------------

export const treeView = { MuiTreeItem };
