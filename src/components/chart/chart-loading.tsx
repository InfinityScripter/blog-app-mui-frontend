import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import { circularTypes } from "./const";

import type { ChartLoadingProps } from "./types";

// ----------------------------------------------------------------------

export function ChartLoading({ sx, type, ...other }: ChartLoadingProps) {
  return (
    <Box
      alignItems="center"
      justifyContent="center"
      sx={{
        top: 0,
        left: 0,
        width: 1,
        zIndex: 9,
        height: 1,
        p: "inherit",
        overflow: "hidden",
        position: "absolute",
        borderRadius: "inherit",
        ...sx,
      }}
      {...other}
    >
      <Skeleton
        variant="circular"
        sx={{
          width: 1,
          height: 1,
          borderRadius: "inherit",
          ...(type &&
            circularTypes.includes(type) && {
              borderRadius: "50%",
            }),
        }}
      />
    </Box>
  );
}
