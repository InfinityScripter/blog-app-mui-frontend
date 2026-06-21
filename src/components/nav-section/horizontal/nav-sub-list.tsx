import { NavUl } from "../styles";
import { NavList } from "./nav-list";

import type { NavSubListProps } from "../types";

// ----------------------------------------------------------------------

export function NavSubList({
  data,
  depth,
  render,
  cssVars,
  slotProps,
  enabledRootRedirect,
}: NavSubListProps) {
  return (
    <NavUl sx={{ gap: 0.5 }}>
      {data.map((list) => (
        <NavList
          key={list.title}
          data={list}
          render={render}
          depth={depth + 1}
          cssVars={cssVars}
          slotProps={slotProps}
          enabledRootRedirect={enabledRootRedirect}
        />
      ))}
    </NavUl>
  );
}
