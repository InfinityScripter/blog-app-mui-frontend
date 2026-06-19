import type { ReactNode } from "react";
import type { Theme, SxProps } from "@mui/material/styles";

import Box from "@mui/material/Box";

import { layoutClasses } from "../classes";

// ----------------------------------------------------------------------

export interface MainProps {
  children?: ReactNode;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

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
