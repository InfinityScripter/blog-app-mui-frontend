import Box from "@mui/material/Box";
import { varAlpha } from "src/theme/styles";
import { useTheme } from "@mui/material/styles";

import { NavVerticalBody } from "./nav-vertical-body";
import { NavVerticalMini } from "./nav-vertical-mini";
import { NavToggleButton } from "../components/nav-toggle-button";

import type { NavVerticalProps } from "./types";

// ----------------------------------------------------------------------

export function NavVertical({
  sx,
  data,
  slots,
  isNavMini,
  layoutQuery,
  onToggleNav,
  ...other
}: NavVerticalProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        height: 1,
        display: "none",
        position: "fixed",
        flexDirection: "column",
        bgcolor: "var(--layout-nav-bg)",
        zIndex: "var(--layout-nav-zIndex)",
        width: isNavMini
          ? "var(--layout-nav-mini-width)"
          : "var(--layout-nav-vertical-width)",
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey["500Channel"], 0.12)})`,
        transition: theme.transitions.create(["width"], {
          easing: "var(--layout-transition-easing)",
          duration: "var(--layout-transition-duration)",
        }),
        [theme.breakpoints.up(layoutQuery)]: {
          display: "flex",
        },
        ...sx,
      }}
    >
      <NavToggleButton
        isNavMini={isNavMini}
        onClick={onToggleNav}
        sx={{
          display: "none",
          [theme.breakpoints.up(layoutQuery)]: {
            display: "inline-flex",
          },
        }}
      />
      {isNavMini ? (
        <NavVerticalMini data={data} slots={slots} {...other} />
      ) : (
        <NavVerticalBody data={data} slots={slots} {...other} />
      )}
    </Box>
  );
}
