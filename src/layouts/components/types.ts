import type { ReactNode } from "react";
import type { Theme, SxProps } from "@mui/material/styles";
import type { ButtonBaseProps } from "@mui/material/ButtonBase";

// ----------------------------------------------------------------------

/**
 * The contact presence status (`online` / `offline` / `busy` / ...) is used
 * directly as the MUI `Badge` `variant` to render a colored dot — that's how
 * the Minimals template wires presence to the badge. The source data comes
 * from the untyped `src/_mock` (`.js`), where `status` is inferred as `string`,
 * so the Badge `variant` union is augmented to accept any string presence key.
 * This keeps `variant={contact.status}` type-safe without a cast and without
 * changing runtime behaviour.
 */
declare module "@mui/material/Badge" {
  interface BadgePropsVariantOverrides {
    [presenceStatus: string]: true;
  }
}

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

export interface ContactItem {
  id: string;
  status: string;
  name: string;
  avatarUrl: string;
  lastActivity?: string | Date;
}

export interface ContactsPopoverProps {
  data?: ContactItem[];
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

export interface LanguageOption {
  value: string;
  label: string;
  countryCode: string;
}

export interface LanguagePopoverProps {
  data?: LanguageOption[];
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

/**
 * Workspace data originates from the untyped `src/_mock` (`.js`), where `plan`
 * is inferred as `string`. Keep it `string` here so the mock assigns without a
 * cast; the popover only compares it to literals like `"Free"`.
 */
export interface WorkspaceItem {
  id: string;
  name: string;
  logo: string;
  plan: string;
}

export interface WorkspacesPopoverProps extends ButtonBaseProps {
  data?: WorkspaceItem[];
}
