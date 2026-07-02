import type { ReactNode } from "react";
import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";
import type { NavSectionDataProps } from "src/components/nav-section/types";

import type { ContactItem } from "../components/contacts-popover";
import type { LanguageOption } from "../components/language-popover";
import type { WorkspaceItem } from "../components/workspaces-popover";
import type { AccountDrawerItem } from "../components/account-drawer";

// ----------------------------------------------------------------------

export interface HeaderBaseData {
  nav?: NavSectionDataProps[];
  langs?: LanguageOption[];
  account?: AccountDrawerItem[];
  contacts?: ContactItem[];
  workspaces?: WorkspaceItem[];
}

export interface HeaderBaseSlots {
  topArea?: ReactNode;
  leftArea?: ReactNode;
  centerArea?: ReactNode;
  rightArea?: ReactNode;
  bottomArea?: ReactNode;
  leftAreaStart?: ReactNode;
  leftAreaEnd?: ReactNode;
  rightAreaStart?: ReactNode;
  rightAreaEnd?: ReactNode;
}

export interface HeaderBaseSlotsDisplay {
  signIn?: boolean;
  account?: boolean;
  helpLink?: boolean;
  settings?: boolean;
  contacts?: boolean;
  searchbar?: boolean;
  workspaces?: boolean;
  menuButton?: boolean;
  localization?: boolean;
  notifications?: boolean;
}

export interface HeaderBaseProps {
  sx?: SxProps<Theme>;
  data?: HeaderBaseData;
  slots?: HeaderBaseSlots;
  slotProps?: Record<string, unknown>;
  onOpenNav?: () => void;
  /**
   * Required: passed straight to `theme.breakpoints.up()`. Every call site
   * (dashboard / main / simple / auth) provides it.
   */
  layoutQuery: Breakpoint;
  slotsDisplay?: HeaderBaseSlotsDisplay;
  [key: string]: unknown;
}

// ----------------------------------------------------------------------

export interface HeaderLeftAreaProps {
  data?: HeaderBaseData;
  slots?: HeaderBaseSlots;
  onOpenNav?: () => void;
  layoutQuery: Breakpoint;
  menuButton: boolean;
  workspaces: boolean;
}

// ----------------------------------------------------------------------

export interface HeaderRightAreaProps {
  data?: HeaderBaseData;
  slots?: HeaderBaseSlots;
  signIn: boolean;
  account: boolean;
  helpLink: boolean;
  settings: boolean;
  contacts: boolean;
  searchbar: boolean;
  localization: boolean;
  notifications: boolean;
}

// ----------------------------------------------------------------------

export interface HeaderSectionSlots {
  topArea?: ReactNode;
  leftArea?: ReactNode;
  centerArea?: ReactNode;
  rightArea?: ReactNode;
  bottomArea?: ReactNode;
  leftAreaStart?: ReactNode;
  leftAreaEnd?: ReactNode;
  rightAreaStart?: ReactNode;
  rightAreaEnd?: ReactNode;
}

export interface HeaderSectionSlotProps {
  toolbar?: { sx?: SxProps<Theme> } & Record<string, unknown>;
  container?: { maxWidth?: false } & { sx?: SxProps<Theme> } & Record<
      string,
      unknown
    >;
}

export interface HeaderSectionProps {
  sx?: SxProps<Theme>;
  slots?: HeaderSectionSlots;
  slotProps?: HeaderSectionSlotProps;
  disableOffset?: boolean;
  disableElevation?: boolean;
  layoutQuery?: Breakpoint;
  [key: string]: unknown;
}

// ----------------------------------------------------------------------

/**
 * CSS custom-property maps fed into `GlobalStyles`. Values are CSS strings or
 * numbers, but entries may nest one level (e.g. a `[data-mui-color-scheme]`
 * selector block) as produced by the layouts' `navColorVars`.
 */
export type CssVars = Record<
  string,
  string | number | undefined | Record<string, string | number | undefined>
>;

export interface LayoutSectionProps {
  sx?: SxProps<Theme>;
  cssVars?: CssVars;
  children?: ReactNode;
  footerSection?: ReactNode;
  headerSection?: ReactNode;
  sidebarSection?: ReactNode;
}
