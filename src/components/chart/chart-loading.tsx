import type { BoxProps } from "@mui/material/Box";
import type { Theme, SxProps } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

// ----------------------------------------------------------------------

interface ChartLoadingProps extends BoxProps {
  sx?: SxProps<Theme>;
  type?: string;
}

export function ChartLoading({ sx, type, ...other }: ChartLoadingProps) {
  const circularTypes = ["donut", "radialBar", "pie", "polarArea"];

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
