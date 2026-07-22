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
          // 20px keeps even the wider RU labels («История LLM», «Сравнение
          // LLM») on one row inside the 1200px header container at the `lg`
          // breakpoint; larger gaps push the right-side icons past the edge.
          gap: 2.5,
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
