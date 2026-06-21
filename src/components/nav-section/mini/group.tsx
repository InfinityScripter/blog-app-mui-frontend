import { NavList } from "./nav-list";
import { NavUl, NavLi } from "../styles";

import type { NavGroupProps } from "../types";

// ----------------------------------------------------------------------

export function Group({
  items,
  render,
  slotProps,
  enabledRootRedirect,
  cssVars,
}: NavGroupProps) {
  return (
    <NavLi>
      <NavUl sx={{ gap: "var(--nav-item-gap)" }}>
        {items.map((list) => (
          <NavList
            key={list.title}
            depth={1}
            data={list}
            render={render}
            cssVars={cssVars}
            slotProps={slotProps}
            enabledRootRedirect={enabledRootRedirect}
          />
        ))}
      </NavUl>
    </NavLi>
  );
}
