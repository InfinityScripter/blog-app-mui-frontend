import type { ReactNode } from "react";

import Box from "@mui/material/Box";
import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

export function InfoBlock({ icon, value }: { icon: string; value: ReactNode }) {
  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      <Iconify icon={icon} width={16} />
      {value}
    </Box>
  );
}
