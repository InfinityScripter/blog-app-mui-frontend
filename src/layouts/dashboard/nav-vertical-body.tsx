import Box from "@mui/material/Box";
import { Logo } from "src/components/logo";
import { Scrollbar } from "src/components/scrollbar";
import { NavSectionVertical } from "src/components/nav-section";

import { NavUpgrade } from "../components/nav-upgrade";

import type { NavVerticalBodyProps } from "./types";

// ----------------------------------------------------------------------

export function NavVerticalBody({
  data,
  slots,
  ...other
}: NavVerticalBodyProps) {
  return (
    <>
      {slots?.topArea ?? (
        <Box sx={{ pl: 3.5, pt: 2.5, pb: 1 }}>
          <Logo />
        </Box>
      )}

      <Scrollbar fillContent>
        <NavSectionVertical
          data={data}
          sx={{ px: 2, flex: "1 1 auto" }}
          {...other}
        />

        {slots?.bottomArea ?? <NavUpgrade />}
      </Scrollbar>
    </>
  );
}
