import Box from "@mui/material/Box";

import type { LayoutOptionContentProps } from "./types";

// ----------------------------------------------------------------------

export function LayoutOptionContent({ selected }: LayoutOptionContentProps) {
  return (
    <Box sx={{ p: 0.5, width: 1, height: 1, flexGrow: 1 }}>
      <Box
        sx={{
          width: 1,
          height: 1,
          opacity: 0.2,
          borderRadius: 0.75,
          bgcolor: "var(--item-bg)",
          ...(selected && { background: "var(--item-active-color)" }),
        }}
      />
    </Box>
  );
}
