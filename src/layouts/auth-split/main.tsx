import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { layoutClasses } from "src/layouts/classes";

import type { AuthSplitMainProps } from "./types";

// ----------------------------------------------------------------------

export function Main({
  sx,
  children,
  layoutQuery,
  ...other
}: AuthSplitMainProps) {
  const theme = useTheme();

  return (
    <Box
      component="main"
      className={layoutClasses.main}
      sx={{
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        [theme.breakpoints.up(layoutQuery)]: {
          flexDirection: "row",
        },
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}
