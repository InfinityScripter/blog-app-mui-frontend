import type { ReactNode } from "react";
import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";
import type { NavSectionDataProps } from "src/components/nav-section/types";

import type { AccountDrawerItem } from "../components/account-drawer";

// ----------------------------------------------------------------------

interface HeaderBaseData {
  nav?: NavSectionDataProps[];
  account?: AccountDrawerItem[];
}

interface HeaderBaseSlots {
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

interface HeaderBaseSlotsDisplay {
  signIn?: boolean;
  account?: boolean;
  helpLink?: boolean;
  settings?: boolean;
  searchbar?: boolean;
  menuButton?: boolean;
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
  slots?: HeaderBaseSlots;
  onOpenNav?: () => void;
  layoutQuery: Breakpoint;
  menuButton: boolean;
}

// ----------------------------------------------------------------------

export interface HeaderRightAreaProps {
  data?: HeaderBaseData;
  slots?: HeaderBaseSlots;
  signIn: boolean;
  account: boolean;
  helpLink: boolean;
  settings: boolean;
  searchbar: boolean;
  notifications: boolean;
}

// ----------------------------------------------------------------------

interface HeaderSectionSlots {
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

interface HeaderSectionSlotProps {
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
type CssVars = Record<
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
