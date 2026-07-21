import Box from "@mui/material/Box";
import { Logo } from "src/components/logo";
import { hideScrollY } from "src/theme/styles";
import { NavSectionMini } from "src/components/nav-section";

import type { NavVerticalMiniProps } from "./types";

// ----------------------------------------------------------------------

export function NavVerticalMini({
  data,
  slots,
  ...other
}: NavVerticalMiniProps) {
  return (
    <>
      {slots?.topArea ?? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2.5 }}>
          <Logo variant="mark" />
        </Box>
      )}

      <NavSectionMini
        data={data}
        sx={{
          pb: 2,
          px: 0.5,
          ...hideScrollY,
          flex: "1 1 auto",
          overflowY: "auto",
        }}
        {...other}
      />

      {slots?.bottomArea}
    </>
  );
}
