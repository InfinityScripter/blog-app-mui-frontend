import { m } from "framer-motion";
import Box from "@mui/material/Box";
import { varFade } from "src/components/animate";

import type { MInviewProps } from "./types";

// ----------------------------------------------------------------------

export function MInview({ children, component = m.div }: MInviewProps) {
  return (
    <Box component={component} variants={varFade({ distance: 24 }).inUp}>
      {children}
    </Box>
  );
}
