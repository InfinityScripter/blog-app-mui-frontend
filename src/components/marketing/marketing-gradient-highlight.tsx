"use client";

import type { ReactNode } from "react";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import {
  marketingHeadlineHighlightSx,
  MARKETING_HEADLINE_GRADIENT_ANIMATE,
  MARKETING_HEADLINE_GRADIENT_TRANSITION,
} from "src/theme/styles";

// ----------------------------------------------------------------------

type MarketingGradientHighlightProps = {
  children: ReactNode;
};

/** Animated primary↔warning gradient text span; same behavior as HomeHero highlight. */
export const MarketingGradientHighlight = ({
  children,
}: MarketingGradientHighlightProps) => (
  <Box
    component={m.span}
    animate={MARKETING_HEADLINE_GRADIENT_ANIMATE}
    transition={MARKETING_HEADLINE_GRADIENT_TRANSITION}
    sx={(theme) => marketingHeadlineHighlightSx(theme)}
  >
    {children}
  </Box>
);
