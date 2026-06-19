import type { ReactNode } from "react";
import type { Theme, SxProps } from "@mui/material/styles";
import type { ButtonBaseProps } from "@mui/material/ButtonBase";

// ----------------------------------------------------------------------

/** A leaf entry inside a main-nav dropdown column. */
export interface MainNavSubItem {
  title: string;
  path: string;
  icon?: ReactNode;
}

/** A column (subheader + items) shown when a top-level main-nav item is open. */
export interface MainNavChildGroup {
  subheader: string;
  items: MainNavSubItem[];
}

/** A top-level entry in the public main navigation. */
export interface MainNavItem {
  title: string;
  path: string;
  icon?: ReactNode;
  children?: MainNavChildGroup[];
}

/**
 * Props shared by the desktop/mobile main-nav item buttons. Extends
 * `ButtonBaseProps` (minus `title`, which we redeclare as a plain string) so
 * the call sites can pass event handlers like `onClick` / `onMouseEnter`
 * straight through to the underlying styled `ButtonBase`.
 */
export interface MainNavItemProps extends Omit<ButtonBaseProps, "title"> {
  title?: string;
  path: string;
  icon?: ReactNode;
  open?: boolean;
  active?: boolean;
  hasChild?: boolean;
  externalLink?: boolean;
  subItem?: boolean;
  sx?: SxProps<Theme>;
}
