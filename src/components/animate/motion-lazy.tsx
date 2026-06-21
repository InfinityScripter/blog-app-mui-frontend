"use client";

import { LazyMotion } from "framer-motion";

import { loadFeaturesAsync } from "./utils";

import type { MotionLazyProps } from "./types";

// ----------------------------------------------------------------------

export function MotionLazy({ children }: MotionLazyProps) {
  return (
    <LazyMotion strict features={loadFeaturesAsync}>
      {children}
    </LazyMotion>
  );
}
