import Stack from "@mui/material/Stack";
import { usePathname } from "src/routes/hooks";
import { removeLastSlash } from "src/routes/utils";
import ListSubheader from "@mui/material/ListSubheader";
import { NavLi, NavUl } from "src/components/nav-section";

import { NavItem } from "./nav-desktop-item";
import { NavItemDashboard } from "./nav-item-dashboard";

import type { NavSubListProps } from "./types";

// ----------------------------------------------------------------------

export function NavSubList({ data, subheader, sx, ...other }: NavSubListProps) {
  const pathname = usePathname();

  const isDashboard = subheader === "Dashboard";

  return (
    <Stack
      component={NavLi}
      alignItems="flex-start"
      sx={{
        flex: "1 1 auto",
        ...(isDashboard && { maxWidth: { md: 1 / 3, lg: 540 } }),
        ...sx,
      }}
      {...other}
    >
      <NavUl>
        <ListSubheader
          disableSticky
          disableGutters
          sx={{ fontSize: 11, color: "text.primary", typography: "overline" }}
        >
          {subheader}
        </ListSubheader>

        {data.map((item) =>
          isDashboard ? (
            <NavLi key={item.title} sx={{ mt: 1.5 }}>
              <NavItemDashboard path={item.path} />
            </NavLi>
          ) : (
            <NavLi key={item.title} sx={{ mt: 1.5 }}>
              <NavItem
                subItem
                title={item.title}
                path={item.path}
                active={item.path === removeLastSlash(pathname)}
              />
            </NavLi>
          ),
        )}
      </NavUl>
    </Stack>
  );
}
