import type { ReactNode, ElementType } from "react";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import { varFade } from "src/components/animate";

// ----------------------------------------------------------------------

interface MInviewProps {
  children?: ReactNode;
  component?: ElementType;
}

export function MInview({ children, component = m.div }: MInviewProps) {
  return (
    <Box component={component} variants={varFade({ distance: 24 }).inUp}>
      {children}
    </Box>
  );
}
