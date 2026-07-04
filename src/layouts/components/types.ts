import type { ReactNode } from "react";
import type { Theme, SxProps } from "@mui/material/styles";

// ----------------------------------------------------------------------

/**
 * A loose view of the authenticated user as the layout reads it.
 *
 * The JWT auth `User` (src/types/domain.ts) does not carry `photoURL` /
 * `displayName`; the layout (account drawer, nav upgrade block) optionally
 * renders them. Every field is optional, so the auth `user` stays assignable.
 * Lives here (not in a component file) so sibling layout components can share
 * it without importing one another — avoids a circular dependency.
 */
export interface LayoutUserView {
  photoURL?: string;
  displayName?: string;
  email?: string;
}

// ----------------------------------------------------------------------

export interface AccountButtonProps {
  open?: boolean;
  photoURL?: string;
  displayName?: string;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

export interface AccountDrawerItem {
  label: string;
  href: string;
  icon: ReactNode;
  info?: ReactNode;
}

export interface AccountDrawerProps {
  data?: AccountDrawerItem[];
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

export interface MenuButtonProps {
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

export interface NavToggleButtonProps {
  isNavMini?: boolean;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

export interface NavUpgradeProps {
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

export interface SettingsButtonProps {
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

export interface SignInButtonProps {
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

export interface SignOutButtonProps {
  onClose?: () => void;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}
