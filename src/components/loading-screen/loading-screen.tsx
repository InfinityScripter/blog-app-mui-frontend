"use client";

import type { BoxProps } from "@mui/material/Box";
import type { Theme, SxProps } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Portal from "@mui/material/Portal";
import LinearProgress from "@mui/material/LinearProgress";

// ----------------------------------------------------------------------

interface LoadingScreenProps extends Omit<BoxProps, "sx"> {
  portal?: boolean;
  sx?: SxProps<Theme>;
}

export function LoadingScreen({ portal, sx, ...other }: LoadingScreenProps) {
  const content = (
    <Box
      sx={{
        px: 5,
        width: 1,
        flexGrow: 1,
        minHeight: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...sx,
      }}
      {...other}
    >
      <LinearProgress color="inherit" sx={{ width: 1, maxWidth: 360 }} />
    </Box>
  );

  if (portal) {
    return <Portal>{content}</Portal>;
  }

  return content;
}
