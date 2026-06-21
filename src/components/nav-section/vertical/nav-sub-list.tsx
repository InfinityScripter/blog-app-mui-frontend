import { NavUl } from "../styles";
import { NavList } from "./nav-list";

import type { NavSubListProps } from "../types";

// ----------------------------------------------------------------------

export function NavSubList({
  data,
  render,
  depth,
  slotProps,
  enabledRootRedirect,
}: NavSubListProps) {
  return (
    <NavUl sx={{ gap: "var(--nav-item-gap)" }}>
      {data.map((list) => (
        <NavList
          key={list.title}
          data={list}
          render={render}
          depth={depth + 1}
          slotProps={slotProps}
          enabledRootRedirect={enabledRootRedirect}
        />
      ))}
    </NavUl>
  );
}
