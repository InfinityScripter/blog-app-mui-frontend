"use client";

import { useTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import { layoutClasses } from "src/layouts/classes";
import { useSettingsContext } from "src/components/settings";

import type { DashboardContentProps } from "./types";

// ----------------------------------------------------------------------

export function DashboardContent({
  sx,
  children,
  disablePadding,
  maxWidth = "lg",
  ...other
}: DashboardContentProps) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const layoutQuery = "lg";

  return (
    <Container
      className={layoutClasses.content}
      maxWidth={settings.compactLayout ? maxWidth : false}
      sx={{
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        pt: "var(--layout-dashboard-content-pt)",
        pb: "var(--layout-dashboard-content-pb)",
        [theme.breakpoints.up(layoutQuery)]: {
          px: "var(--layout-dashboard-content-px)",
        },
        ...(disablePadding && {
          p: {
            xs: 0,
            sm: 0,
            md: 0,
            lg: 0,
            xl: 0,
          },
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Container>
  );
}
