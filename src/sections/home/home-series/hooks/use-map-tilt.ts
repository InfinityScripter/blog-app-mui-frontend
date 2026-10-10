import { useRef } from "react";
import { useScroll, useTransform, useReducedMotion } from "framer-motion";

// ----------------------------------------------------------------------

export function useMapTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const still = useReducedMotion() === true;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.4"],
  });

  return {
    ref,
    rotateX: useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [22, 0]),
    scale: useTransform(scrollYProgress, [0, 1], still ? [1, 1] : [0.88, 1]),
  };
}
