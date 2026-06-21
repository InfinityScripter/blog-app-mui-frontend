import Box from "@mui/material/Box";
import { useSpring, useMotionValue } from "framer-motion";

import { ScrollProgressLinear } from "./scroll-progress-linear";
import { useScrollProgress } from "./hooks/use-scroll-progress";
import { ScrollProgressCircular } from "./scroll-progress-circular";

import type { ScrollProgressProps } from "./types";

// ----------------------------------------------------------------------

export function ScrollProgress({
  size,
  variant,
  progress,
  thickness = 3.6,
  color = "primary",
  sx,
  ...other
}: ScrollProgressProps) {
  const pageProgress = useScrollProgress();
  const localProgress = useMotionValue(
    typeof progress === "number" ? progress : 0,
  );

  const progressValue =
    typeof progress === "number"
      ? localProgress
      : (progress ?? pageProgress.scrollYProgress);

  if (typeof progress === "number" && localProgress.get() !== progress) {
    localProgress.set(progress);
  }

  const scaleX = useSpring(progressValue, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const progressSize = variant === "circular" ? (size ?? 64) : (size ?? 3);

  return (
    <Box sx={{ overflow: "hidden" }}>
      {variant === "circular" ? (
        <ScrollProgressCircular
          progressSize={progressSize}
          thickness={thickness}
          color={color}
          progressValue={progressValue}
          sx={sx}
          {...other}
        />
      ) : (
        <ScrollProgressLinear
          progressSize={progressSize}
          color={color}
          scaleX={scaleX}
          sx={sx}
          {...other}
        />
      )}
    </Box>
  );
}
