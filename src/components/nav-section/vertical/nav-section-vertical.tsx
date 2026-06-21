import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";

import { NavUl } from "../styles";
import { navSectionClasses } from "../classes";
import { navSectionCssVars } from "../css-vars";
import { Group } from "./nav-section-vertical-group";

import type { NavSectionProps } from "../types";

// ----------------------------------------------------------------------

export function NavSectionVertical({
  sx,
  data,
  render,
  slotProps,
  enabledRootRedirect,
  cssVars: overridesVars,
}: NavSectionProps) {
  const theme = useTheme();

  const cssVars = {
    ...navSectionCssVars.vertical(theme),
    ...overridesVars,
  };

  return (
    <Stack
      component="nav"
      className={navSectionClasses.vertical.root}
      sx={{ ...cssVars, ...sx }}
    >
      <NavUl sx={{ flex: "1 1 auto", gap: "var(--nav-item-gap)" }}>
        {data.map((group) => (
          <Group
            key={group.subheader ?? group.items[0].title}
            subheader={group.subheader}
            items={group.items}
            render={render}
            slotProps={slotProps}
            enabledRootRedirect={enabledRootRedirect}
          />
        ))}
      </NavUl>
    </Stack>
  );
}
