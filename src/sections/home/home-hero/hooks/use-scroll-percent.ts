import { useRef } from "react";
import { useScroll } from "framer-motion";

// ----------------------------------------------------------------------

export function useScrollPercent() {
  const elementRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  return { elementRef, scrollY };
}
