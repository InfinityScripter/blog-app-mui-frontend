"use client";

import type { ReactNode } from "react";
import type { Theme } from "@mui/material/styles";
import type { SystemStyleObject } from "@mui/system";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import {
  textGradient,
  marketingHeadlineGradientCss,
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
    sx={(theme: Theme): SystemStyleObject<Theme> => ({
      ...textGradient(marketingHeadlineGradientCss(theme)),
      backgroundSize: "400%",
      ml: { xs: 0.75, md: 1, xl: 1.5 },
    })}
  >
    {children}
  </Box>
);
