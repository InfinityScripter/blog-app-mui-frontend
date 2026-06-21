import { m } from "framer-motion";
import Box from "@mui/material/Box";

import type { ScrollProgressCircularProps } from "./types";

// ----------------------------------------------------------------------

export function ScrollProgressCircular({
  progressSize,
  thickness,
  color,
  progressValue,
  sx,
  ...other
}: ScrollProgressCircularProps) {
  return (
    <Box
      component="svg"
      width={progressSize}
      height={progressSize}
      viewBox={`0 0 ${progressSize} ${progressSize}`}
      xmlns="http://www.w3.org/2000/svg"
      sx={{
        width: progressSize,
        height: progressSize,
        transform: "rotate(-90deg)",
        color: (theme) =>
          theme.vars?.palette.text.primary ?? theme.palette.text.primary,
        ...(color !== "inherit" && {
          color: (theme) =>
            theme.vars?.palette[color].main ?? theme.palette[color].main,
        }),
        circle: {
          fill: "none",
          strokeDashoffset: 0,
          strokeWidth: thickness,
          stroke: "currentColor",
        },
        ...sx,
      }}
      {...other}
    >
      <Box
        component="circle"
        cx={progressSize / 2}
        cy={progressSize / 2}
        r={progressSize / 2 - thickness - 4}
        strokeOpacity="0.2"
        pathLength="1"
      />
      <Box
        component={m.circle}
        cx={progressSize / 2}
        cy={progressSize / 2}
        r={progressSize / 2 - thickness - 4}
        pathLength="1"
        style={{ pathLength: progressValue }}
      />
    </Box>
  );
}
