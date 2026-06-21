import type { Variants } from "framer-motion";

import { m } from "framer-motion";

// ----------------------------------------------------------------------

export function PlusIcon() {
  const drawPlus: Variants = {
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

  return (
    <>
      <m.path
        variants={drawPlus}
        d="M8 0V16M16 8.08889H0"
        stroke="var(--hero-plus-stroke-color)"
        style={{ transform: "translate(calc(50% - 448px), calc(50% - 128px))" }}
      />

      <m.path
        variants={drawPlus}
        d="M8 0V16M16 8.08889H0"
        stroke="var(--hero-plus-stroke-color)"
        style={{ transform: "translate(calc(50% + 432px), calc(50% + 192px))" }}
      />
    </>
  );
}
