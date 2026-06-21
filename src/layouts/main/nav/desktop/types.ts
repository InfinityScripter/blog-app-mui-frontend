import type { Theme, SxProps } from "@mui/material/styles";

import type { MainNavItem, MainNavSubItem } from "../types";

// ----------------------------------------------------------------------

export interface StyledNavItemProps {
  active?: boolean;
  open?: boolean;
  subItem?: boolean;
}

export interface NavItemDashboardProps {
  path: string;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

export interface NavListProps {
  data: MainNavItem;
}

export interface NavSubListProps {
  data: MainNavSubItem[];
  subheader: string;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

export interface NavDesktopProps {
  data: MainNavItem[];
  sx?: SxProps<Theme>;
}
