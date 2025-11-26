import { useMemo } from "react";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { Breakpoint } from "@mui/material/styles";

// ----------------------------------------------------------------------

type ResponsiveQuery = "up" | "down" | "between" | "only";

export function useResponsive(
  query: ResponsiveQuery,
  start: Breakpoint | number,
  end?: Breakpoint | number
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
        return theme.breakpoints.only(start as Breakpoint);
      default:
        return theme.breakpoints.up("xs");
    }
  }, [theme, query, start, end]);

  const mediaQueryResult = useMediaQuery(getQuery);

  return mediaQueryResult;
}

// ----------------------------------------------------------------------

export function useWidth(): Breakpoint {
  const theme = useTheme();

  const keys = useMemo(() => [...theme.breakpoints.keys].reverse(), [theme]);

  const width = keys.reduce((output: Breakpoint | null, key) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const matches = useMediaQuery(theme.breakpoints.up(key));

    return !output && matches ? key : output;
  }, null);

  return width || "xs";
}
