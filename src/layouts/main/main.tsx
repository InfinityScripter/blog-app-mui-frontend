import Box from "@mui/material/Box";

import { layoutClasses } from "../classes";

import type { MainProps } from "./types";

// ----------------------------------------------------------------------

export function Main({ children, sx, ...other }: MainProps) {
  return (
    <Box
      component="main"
      className={layoutClasses.main}
      sx={{
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}
