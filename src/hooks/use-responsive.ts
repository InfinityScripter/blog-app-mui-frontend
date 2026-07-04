"use client";

import type { Breakpoint } from "@mui/material/styles";

import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// ----------------------------------------------------------------------

type ResponsiveQuery = "up" | "down" | "between" | "only";

export function useResponsive(
  query: ResponsiveQuery,
  start: Breakpoint | number,
  end?: Breakpoint | number,
): boolean {
  const theme = useTheme();

  const getQuery = useMemo(() => {
    switch (query) {
      case "up":
        return theme.breakpoints.up(start);
      case "down":
        return theme.breakpoints.down(start);
      case "between":
        return theme.breakpoints.between(start, end ?? "xl");
      case "only":
        return theme.breakpoints.only(typeof start === "number" ? "xs" : start);
      default:
        return theme.breakpoints.up("xs");
    }
  }, [theme, query, start, end]);

  const mediaQueryResult = useMediaQuery(getQuery);

  return mediaQueryResult;
}
