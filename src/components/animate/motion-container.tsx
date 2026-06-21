import { forwardRef } from "react";
import Box from "@mui/material/Box";
import { m, useReducedMotion } from "framer-motion";

import { varContainer } from "./variants";

import type { MotionContainerProps } from "./types";

export const MotionContainer = forwardRef<HTMLDivElement, MotionContainerProps>(
  ({ animate, action = false, children, ...other }, ref) => {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
      return (
        <Box ref={ref} {...other}>
          {children}
        </Box>
      );
    }

    const commonProps = {
      ref,
      component: m.div,
      variants: varContainer({}),
      initial: action ? false : "initial",
      animate: action ? (animate ? "animate" : "exit") : "animate",
      exit: action ? undefined : "exit",
      ...other,
    };

    return <Box {...commonProps}>{children}</Box>;
  },
);
