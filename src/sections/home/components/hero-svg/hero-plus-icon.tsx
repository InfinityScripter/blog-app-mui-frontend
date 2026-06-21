import { m } from "framer-motion";

import { drawPlus } from "./const";

// ----------------------------------------------------------------------

export function PlusIcon() {
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
