"use client";

import type { ReactNode } from "react";
import type { Theme, SxProps } from "@mui/material/styles";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { layoutClasses } from "src/layouts/classes";
import { useSettingsContext } from "src/components/settings";
import Container, { type ContainerProps } from "@mui/material/Container";

// ----------------------------------------------------------------------

interface MainProps {
  children: ReactNode;
  isNavHorizontal?: boolean;
  sx?: SxProps<Theme>;
}

export function Main({ children, isNavHorizontal, sx, ...other }: MainProps) {
  return (
    <Box
      component="main"
      className={layoutClasses.main}
      sx={{
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        ...(isNavHorizontal && {
          "--layout-dashboard-content-pt": "40px",
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------

interface DashboardContentProps extends Omit<ContainerProps, "maxWidth"> {
  sx?: SxProps<Theme>;
  children: ReactNode;
  disablePadding?: boolean;
  maxWidth?: ContainerProps["maxWidth"];
}

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
