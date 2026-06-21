import type { Variants } from "framer-motion";

// ----------------------------------------------------------------------

export const draw: Record<"x" | "y", Variants> = {
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

export const drawCircle: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number) => {
    const delay = 1 + i * 0.5;
    return { opacity: 1, transition: { opacity: { delay, duration: 0.01 } } };
  },
};

export const drawPlus: Variants = {
  hidden: { opacity: 0, pathLength: 0 },
  visible: (i: number) => {
    const delay = 1 + i * 0.5;
    return {
      opacity: 1,
      pathLength: 1,
      transition: {
        opacity: { delay, duration: 0.01 },
        pathLength: {
          delay,
          bounce: 0,
          duration: 1.5,
          type: "spring",
        },
      },
    };
  },
};
