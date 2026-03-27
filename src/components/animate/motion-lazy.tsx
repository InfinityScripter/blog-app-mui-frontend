"use client";

import type { ReactNode } from "react";

import { LazyMotion } from "framer-motion";

const loadFeaturesAsync = async () =>
  import("./features").then((res) => res.default);

// ----------------------------------------------------------------------

interface MotionLazyProps {
  children?: ReactNode;
}

export function MotionLazy({ children }: MotionLazyProps) {
  return (
    <LazyMotion strict features={loadFeaturesAsync}>
      {children}
    </LazyMotion>
  );
}
