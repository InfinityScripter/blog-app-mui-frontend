import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";

import { Group } from "./group";
import { NavUl } from "../styles";
import { navSectionClasses } from "../classes";
import { navSectionCssVars } from "../css-vars";

import type { NavSectionProps } from "../types";

// ----------------------------------------------------------------------

export function NavSectionMini({
  sx,
  data,
  render,
  slotProps,
  enabledRootRedirect,
  cssVars: overridesVars,
}: NavSectionProps) {
  const theme = useTheme();

  const cssVars = {
    ...navSectionCssVars.mini(theme),
    ...overridesVars,
  };

  return (
    <Stack
      component="nav"
      className={navSectionClasses.mini.root}
      sx={{ ...cssVars, ...sx }}
    >
      <NavUl sx={{ flex: "1 1 auto", gap: "var(--nav-item-gap)" }}>
        {data.map((group) => (
          <Group
            key={group.subheader ?? group.items[0].title}
            render={render}
            cssVars={cssVars}
            items={group.items}
            slotProps={slotProps}
            enabledRootRedirect={enabledRootRedirect}
          />
        ))}
      </NavUl>
    </Stack>
  );
}
