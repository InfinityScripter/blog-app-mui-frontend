import Stack from "@mui/material/Stack";
import { NavUl } from "src/components/nav-section";

import { NavList } from "./nav-desktop-list";

import type { NavDesktopProps } from "./types";

// ----------------------------------------------------------------------

export function NavDesktop({ data, sx }: NavDesktopProps) {
  return (
    <Stack component="nav" sx={{ height: 1, ...sx }}>
      <NavUl
        sx={{
          // The 8 RU labels need ~670px at 20px gaps, which leaves the `lg`
          // header (1152px of content) 11px short of fitting logo + nav +
          // utilities — the zone spacer collapses and the nav touches search.
          // 16px through `lg` buys back 28px; `xl` up has room to spare.
          gap: { lg: 2, xl: 2.5 },
          height: 1,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {data.map((list) => (
          <NavList key={list.title} data={list} />
        ))}
      </NavUl>
    </Stack>
  );
}
