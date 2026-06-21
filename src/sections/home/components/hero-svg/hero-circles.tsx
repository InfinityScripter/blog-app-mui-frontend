import type { Variants } from "framer-motion";

import { m } from "framer-motion";

// ----------------------------------------------------------------------

export function Circles() {
  const drawCircle: Variants = {
    hidden: { opacity: 0 },
    visible: (i: number) => {
      const delay = 1 + i * 0.5;
      return { opacity: 1, transition: { opacity: { delay, duration: 0.01 } } };
    },
  };

  return (
    <>
      <m.path
        variants={drawCircle}
        d="M1 41C1 63.0914 18.9086 81 41 81C63.0914 81 81 63.0914 81 41C81 18.9086 63.0914 1 41 1"
        style={{
          strokeDasharray: "var(--stroke-dasharray)",
          stroke: "var(--hero-circle-stroke-color)",
          strokeWidth: "var(--hero-circle-stroke-width)",
          transform: "translate(calc(50% - 480px), calc(50% - 80px))",
        }}
      />

      <m.path
        variants={drawCircle}
        d="M1 41C1 63.0914 18.9086 81 41 81C63.0914 81 81 63.0914 81 41C81 18.9086 63.0914 1 41 1"
        style={{
          strokeDasharray: "var(--stroke-dasharray)",
          stroke: "var(--hero-circle-stroke-color)",
          strokeWidth: "var(--hero-circle-stroke-width)",
          transform: "translate(calc(50% + 400px), calc(50% + 80px))",
        }}
      />

      <m.circle
        cx="50%"
        cy="50%"
        fill="var(--hero-circle-stroke-color)"
        style={{ transform: "translate(calc(0% - 200px), calc(0% + 200px))" }}
        initial={{ r: 0 }}
        animate={{ r: 5 }}
      />
    </>
  );
}
