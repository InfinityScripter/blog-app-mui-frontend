import type { ReactNode } from "react";
import type { BoxProps } from "@mui/material/Box";

import { m } from "framer-motion";
import { forwardRef } from "react";
import Box from "@mui/material/Box";

import { varContainer } from "./variants";

interface MotionContainerProps extends Omit<BoxProps, "component"> {
  animate?: boolean;
  action?: boolean;
  children?: ReactNode;
}

export const MotionContainer = forwardRef<HTMLDivElement, MotionContainerProps>(
  ({ animate, action = false, children, ...other }, ref) => {
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
