import { useResponsive } from "src/hooks/use-responsive";
import { useScroll, useTransform, useReducedMotion } from "framer-motion";

import { heroMotionTargets } from "../utils";

// ----------------------------------------------------------------------

// Pinned distance of the stage: .ls-hero is 210vh tall, the stage is ~100vh.
const PIN_VIEWPORTS = 1.1;

export function useHeroScroll() {
  const reducedMotion = useReducedMotion();
  const mdUp = useResponsive("up", "md");
  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, (y) =>
    typeof window === "undefined"
      ? 0
      : Math.min(1, y / (window.innerHeight * PIN_VIEWPORTS)),
  );
  // Phones get no pin: the stage is taller than the screen, so fading or
  // dimming it would hide the buttons while they are still being read.
  const target = heroMotionTargets(
    reducedMotion === true ? "still" : mdUp ? "desktop" : "phone",
  );

  const fade = useTransform(progress, [0, 0.35], [1, target.fade]);

  return {
    topX: useTransform(progress, [0, 1], ["0vw", `${-target.wordShift}vw`]),
    bottomX: useTransform(progress, [0, 1], ["0vw", `${target.wordShift}vw`]),
    hostScale: useTransform(progress, [0, 1], [1, target.hostScale]),
    night: useTransform(progress, [0.45, 1], [0, target.night]),
    fade,
    // A faded-out link must not stay clickable or reachable with Tab.
    metaVisibility: useTransform(fade, (v) =>
      v < 0.05 ? "hidden" : "visible",
    ),
  };
}
