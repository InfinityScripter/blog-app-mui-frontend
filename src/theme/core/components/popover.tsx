import { listClasses } from "@mui/material/List";

import { paper } from "../../styles";
import { type ThemeWithVars } from "./types";

// ----------------------------------------------------------------------

const MuiPopover = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    paper: ({ theme }: { theme: ThemeWithVars }) => ({
      ...paper({ theme, dropdown: true }),
      [`& .${listClasses.root}`]: { paddingTop: 0, paddingBottom: 0 },
    }),
  },
};

// ----------------------------------------------------------------------

export const popover = { MuiPopover };
