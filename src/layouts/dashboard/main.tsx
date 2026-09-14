"use client";

import Box from "@mui/material/Box";
import { layoutClasses } from "src/layouts/classes";
import { LAYOUT, layoutCssPx } from "src/layouts/config-layout";

import type { MainProps } from "./types";

// ----------------------------------------------------------------------

export { DashboardContent } from "./dashboard-content";

export function Main({ children, isNavHorizontal, sx, ...other }: MainProps) {
  return (
    <Box
      component="main"
      className={layoutClasses.main}
      sx={{
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        p: 3,
        ...(isNavHorizontal && {
          "--layout-dashboard-content-pt": layoutCssPx(
            LAYOUT.dashboardContentPtHorizontal,
          ),
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}
