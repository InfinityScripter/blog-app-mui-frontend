import type { ReactNode } from "react";
import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";
import type { NavSectionDataProps } from "src/components/nav-section/types";

import { HeaderSection } from "./header-section";
import { HeaderLeftArea } from "./header-left-area";
import { HeaderRightArea } from "./header-right-area";

import type { ContactItem } from "../components/contacts-popover";
import type { LanguageOption } from "../components/language-popover";
import type { WorkspaceItem } from "../components/workspaces-popover";
import type { AccountDrawerItem } from "../components/account-drawer";
import type { NotificationItemData } from "../components/notifications-drawer/notification-item";

// ----------------------------------------------------------------------

export interface HeaderBaseData {
  nav?: NavSectionDataProps[];
  langs?: LanguageOption[];
  account?: AccountDrawerItem[];
  contacts?: ContactItem[];
  workspaces?: WorkspaceItem[];
  notifications?: NotificationItemData[];
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

export function HeaderBase({
  sx,
  data,
  slots,
  slotProps,
  onOpenNav,
  layoutQuery,

  slotsDisplay: {
    signIn = true,
    account = true,
    helpLink = false,
    settings = true,
    contacts = false,
    searchbar = true,
    workspaces = false,
    menuButton = true,
    localization = false,
    notifications = false,
  } = {},

  ...other
}: HeaderBaseProps) {
  return (
    <HeaderSection
      sx={sx}
      layoutQuery={layoutQuery}
      slots={{
        ...slots,
        leftAreaStart: slots?.leftAreaStart,
        leftArea: (
          <HeaderLeftArea
            data={data}
            slots={slots}
            onOpenNav={onOpenNav}
            layoutQuery={layoutQuery}
            menuButton={menuButton}
            workspaces={workspaces}
          />
        ),
        rightArea: (
          <HeaderRightArea
            data={data}
            slots={slots}
            signIn={signIn}
            account={account}
            helpLink={helpLink}
            settings={settings}
            contacts={contacts}
            searchbar={searchbar}
            localization={localization}
            notifications={notifications}
          />
        ),
      }}
      slotProps={slotProps}
      {...other}
    />
  );
}
