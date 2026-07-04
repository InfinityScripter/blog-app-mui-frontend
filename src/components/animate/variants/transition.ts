import type { Transition } from "framer-motion";

// ----------------------------------------------------------------------

export interface TransitionProps {
  duration?: number;
  durationIn?: number;
  durationOut?: number;
  ease?: Transition["ease"];
  easeIn?: Transition["ease"];
  easeOut?: Transition["ease"];
}

const DEFAULT_EASE: NonNullable<Transition["ease"]> = [0.43, 0.13, 0.23, 0.96];

// --------------- Marketing / viewport (scroll-triggered) ---------------

export const varTranEnter = (props?: TransitionProps): Transition => {
  const duration = props?.durationIn ?? 0.64;
  const ease = props?.easeIn ?? DEFAULT_EASE;

  return { duration, ease };
};

export const varTranExit = (props?: TransitionProps): Transition => {
  const duration = props?.durationOut ?? 0.48;
  const ease = props?.easeOut ?? DEFAULT_EASE;

  return { duration, ease };
};
