import { menuItem } from "../../styles";
import { type ThemeWithVars } from "./types";

// ----------------------------------------------------------------------

const MuiMenuItem = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: ThemeWithVars }) => ({ ...menuItem(theme) }),
  },
};

// ----------------------------------------------------------------------

export const menu = { MuiMenuItem };
