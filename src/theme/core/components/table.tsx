import type { Theme } from "@mui/material/styles";

import { tableRowClasses } from "@mui/material/TableRow";
import { tableCellClasses } from "@mui/material/TableCell";

import { varAlpha } from "../../styles";
import { type ThemeWithVars } from "./types";

// ----------------------------------------------------------------------

const MuiTableContainer = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({
      position: "relative",
      scrollbarWidth: "thin",
      scrollbarColor: `${varAlpha(theme.vars.palette.text.disabledChannel, 0.4)} ${varAlpha(theme.vars.palette.text.disabledChannel, 0.08)}`,
    }),
  },
};

// ----------------------------------------------------------------------

const MuiTable = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({
      "--palette-TableCell-border": theme.vars.palette.divider,
    }),
  },
};

// ----------------------------------------------------------------------

const MuiTableRow = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({
      [`&.${tableRowClasses.selected}`]: {
        backgroundColor: varAlpha(theme.vars.palette.primary.darkChannel, 0.04),
        "&:hover": {
          backgroundColor: varAlpha(
            theme.vars.palette.primary.darkChannel,
            0.08,
          ),
        },
      },
      "&:last-of-type": {
        [`& .${tableCellClasses.root}`]: { borderColor: "transparent" },
      },
    }),
  },
};

// ----------------------------------------------------------------------

const MuiTableCell = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: { borderBottomStyle: "dashed" },
    head: ({ theme }: { theme: ThemeWithVars }) => ({
      fontSize: 14,
      color: theme.vars.palette.text.secondary,
      fontWeight: theme.typography.fontWeightSemiBold,
      backgroundColor: theme.vars.palette.background.neutral,
    }),
    stickyHeader: ({ theme }: { theme: Theme }) => ({
      backgroundColor: theme.vars.palette.background.paper,
      backgroundImage: `linear-gradient(to bottom, ${theme.vars.palette.background.neutral} 0%, ${theme.vars.palette.background.neutral} 100%)`,
    }),
    paddingCheckbox: ({ theme }: { theme: Theme }) => ({
      paddingLeft: theme.spacing(1),
    }),
  },
};

// ----------------------------------------------------------------------

const MuiTablePagination = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: {
    backIconButtonProps: { size: "small" },
    nextIconButtonProps: { size: "small" },
    slotProps: { select: { name: "table-pagination-select" } },
  },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: { width: "100%" },
    toolbar: { height: 64 },
    actions: { marginRight: 8 },
    select: ({ theme }: { theme: Theme }) => ({
      paddingLeft: 8,
      "&:focus": { borderRadius: theme.shape.borderRadius },
    }),
    selectIcon: {
      right: 4,
      width: 16,
      height: 16,
      top: "calc(50% - 8px)",
    },
  },
};

// ----------------------------------------------------------------------

export const table = {
  MuiTable,
  MuiTableRow,
  MuiTableCell,
  MuiTableContainer,
  MuiTablePagination,
};
