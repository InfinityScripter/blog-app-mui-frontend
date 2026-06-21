import type { Variants } from "framer-motion";

import { m } from "framer-motion";

// ----------------------------------------------------------------------

interface LinesProps {
  strokeCount: number;
}

export function Lines({ strokeCount }: LinesProps) {
  const draw: Record<"x" | "y", Variants> = {
    x: {
      hidden: { x2: 0, strokeOpacity: 0 },
      visible: (i: number) => {
        const delay = 1 + i * 0.5;
        return {
          x2: "100%",
          strokeOpacity: 1,
          transition: {
            strokeOpacity: { delay, duration: 0.01 },
            x2: {
              delay,
              bounce: 0,
              duration: 1.5,
              type: "spring",
            },
          },
        };
      },
    },
    y: {
      hidden: { y2: 0, strokeOpacity: 0 },
      visible: (i: number) => {
        const delay = 1 + i * 0.5;
        return {
          y2: "100%",
          strokeOpacity: 1,
          transition: {
            strokeOpacity: { delay, duration: 0.01 },
            y2: {
              delay,
              bounce: 0,
              duration: 1.5,
              type: "spring",
            },
          },
        };
      },
    },
  };

  const translateY = (index: number) =>
    strokeCount / 2 > index
      ? `translateY(calc(((${index} * var(--stroke-spacing)) + var(--stroke-spacing) / 2) * -1))`
      : `translateY(calc(((${strokeCount - (index + 1)} * var(--stroke-spacing)) + var(--stroke-spacing) / 2)))`;

  const linesX = (
    <>
      {[...Array(strokeCount)].map((_, index) => (
        <m.line
          key={index}
          x1="0"
          x2="100%"
          y1="50%"
          y2="50%"
          variants={draw.x}
          style={{
            transform: translateY(index),
            stroke: "var(--hero-line-stroke-color)",
            strokeDasharray: "var(--stroke-dasharray)",
            strokeWidth: "var(--hero-line-stroke-width)",
          }}
        />
      ))}
    </>
  );

  const translateX = (index: number) =>
    strokeCount / 2 > index
      ? `translateX(calc(((${index} * var(--stroke-spacing)) + var(--stroke-spacing) / 2) * -1))`
      : `translateX(calc(((${strokeCount - (index + 1)} * var(--stroke-spacing)) + var(--stroke-spacing) / 2)))`;

  const linesY = (
    <>
      {[...Array(strokeCount)].map((_, index) => (
        <m.line
          key={index}
          x1="50%"
          x2="50%"
          y1="0%"
          y2="100%"
          variants={draw.y}
          style={{
            transform: translateX(index),
            stroke: "var(--hero-line-stroke-color)",
            strokeDasharray: "var(--stroke-dasharray)",
            strokeWidth: "var(--hero-line-stroke-width)",
          }}
        />
      ))}
    </>
  );

  return (
    <>
      {linesX}
      {linesY}
    </>
  );
}
