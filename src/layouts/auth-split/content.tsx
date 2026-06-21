import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { layoutClasses } from "src/layouts/classes";

import type { AuthSplitContentProps } from "./types";

// ----------------------------------------------------------------------

export function Content({
  sx,
  children,
  layoutQuery,
  ...other
}: AuthSplitContentProps) {
  const theme = useTheme();

  const renderContent = (
    <Box
      sx={{
        width: 1,
        display: "flex",
        flexDirection: "column",
        maxWidth: "var(--layout-auth-content-width)",
      }}
    >
      {children}
    </Box>
  );

  return (
    <Box
      className={layoutClasses.content}
      sx={{
        px: 2,
        py: 5,
        display: "flex",
        flex: "1 1 auto",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        [theme.breakpoints.up(layoutQuery)]: {
          px: 0,
          py: "calc(var(--layout-header-desktop-height) + 24px)",
        },
        ...sx,
      }}
      {...other}
    >
      {renderContent}
    </Box>
  );
}
