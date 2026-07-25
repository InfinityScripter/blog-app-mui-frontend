import { m } from "framer-motion";
import Box from "@mui/material/Box";

import type { ScrollProgressLinearProps } from "./types";

// ----------------------------------------------------------------------

export function ScrollProgressLinear({
  progressSize,
  color,
  scaleX,
  sx,
  ...other
}: ScrollProgressLinearProps) {
  return (
    <Box
      component={m.div}
      sx={{
        // Fixed to the viewport: without it the bar sits in normal flow under
        // the sticky header and scrolls away, so it was only ever visible at
        // the very top of the page. zIndex clears the header (1100).
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1999,
        height: progressSize,
        transformOrigin: "0%",
        bgcolor: "text.primary",
        ...(color !== "inherit" && {
          background: (theme) =>
            `linear-gradient(135deg, ${theme.vars?.palette[color].light ?? theme.palette[color].light}, ${theme.vars?.palette[color].main ?? theme.palette[color].main})`,
        }),
        ...sx,
      }}
      style={{ scaleX }}
      {...other}
    />
  );
}
