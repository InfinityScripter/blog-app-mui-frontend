import type { ReactNode } from "react";
import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";
import type { NavSectionDataProps } from "src/components/nav-section/types";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { paths } from "src/routes/paths";
import { Logo } from "src/components/logo";
import { RouterLink } from "src/routes/components";
import { styled, useTheme } from "@mui/material/styles";

import { HeaderSection } from "./header-section";
import { Searchbar } from "../components/searchbar";
import { MenuButton } from "../components/menu-button";
import { SignInButton } from "../components/sign-in-button";
import { AccountDrawer } from "../components/account-drawer";
import { SettingsButton } from "../components/settings-button";
import { LanguagePopover } from "../components/language-popover";
import { ContactsPopover } from "../components/contacts-popover";
import { WorkspacesPopover } from "../components/workspaces-popover";
import { NotificationsDrawer } from "../components/notifications-drawer";

import type { ContactItem } from "../components/contacts-popover";
import type { LanguageOption } from "../components/language-popover";
import type { WorkspaceItem } from "../components/workspaces-popover";
import type { AccountDrawerItem } from "../components/account-drawer";
import type { NotificationItemData } from "../components/notifications-drawer/notification-item";

// ----------------------------------------------------------------------

const StyledDivider = styled("span")(({ theme }) => ({
  width: 1,
  height: 10,
  flexShrink: 0,
  display: "none",
  position: "relative",
  alignItems: "center",
  flexDirection: "column",
  marginLeft: theme.spacing(2.5),
  marginRight: theme.spacing(2.5),
  backgroundColor: "currentColor",
  color: theme.vars.palette.divider,
  "&::before, &::after": {
    top: -5,
    width: 3,
    height: 3,
    content: '""',
    flexShrink: 0,
    borderRadius: "50%",
    position: "absolute",
    backgroundColor: "currentColor",
  },
  "&::after": { bottom: -5, top: "auto" },
}));

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
  const theme = useTheme();

  return (
    <HeaderSection
      sx={sx}
      layoutQuery={layoutQuery}
      slots={{
        ...slots,
        leftAreaStart: slots?.leftAreaStart,
        leftArea: (
          <>
            {slots?.leftAreaStart}

            {/* -- Menu button -- */}
            {menuButton && (
              <MenuButton
                data-slot="menu-button"
                onClick={onOpenNav}
                sx={{
                  mr: 1,
                  ml: -1,
                  [theme.breakpoints.up(layoutQuery)]: { display: "none" },
                }}
              />
            )}

            {/* -- Logo -- */}
            <Logo data-slot="logo" />

            {/* -- Divider -- */}
            <StyledDivider data-slot="divider" />

            {/* -- Workspace popover -- */}
            {workspaces && (
              <WorkspacesPopover
                data-slot="workspaces"
                data={data?.workspaces}
              />
            )}

            {slots?.leftAreaEnd}
          </>
        ),
        rightArea: (
          <>
            {slots?.rightAreaStart}

            <Box
              data-area="right"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 1.5 },
              }}
            >
              {/* -- Help link -- */}
              {helpLink && (
                <Link
                  data-slot="help-link"
                  href={paths.post.root}
                  component={RouterLink}
                  color="inherit"
                  sx={{ typography: "subtitle2" }}
                >
                  Блог
                </Link>
              )}

              {/* -- Searchbar -- */}
              {searchbar && (
                <Searchbar data-slot="searchbar" data={data?.nav} />
              )}

              {/* -- Language popover -- */}
              {localization && (
                <LanguagePopover data-slot="localization" data={data?.langs} />
              )}

              {/* -- Notifications popover -- */}
              {notifications && (
                <NotificationsDrawer
                  data-slot="notifications"
                  data={data?.notifications}
                />
              )}

              {/* -- Contacts popover -- */}
              {contacts && (
                <ContactsPopover data-slot="contacts" data={data?.contacts} />
              )}

              {/* -- Settings button -- */}
              {settings && <SettingsButton data-slot="settings" />}

              {/* -- Account drawer -- */}
              {account && (
                <AccountDrawer data-slot="account" data={data?.account} />
              )}

              {/* -- Sign in button -- */}
              {signIn && <SignInButton />}
            </Box>

            {slots?.rightAreaEnd}
          </>
        ),
      }}
      slotProps={slotProps}
      {...other}
    />
  );
}
