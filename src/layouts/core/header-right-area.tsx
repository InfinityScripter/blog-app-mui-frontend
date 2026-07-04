import type { ReactNode } from "react";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { Searchbar } from "../components/searchbar";
import { SignInButton } from "../components/sign-in-button";
import { AccountDrawer } from "../components/account-drawer";
import { SettingsButton } from "../components/settings-button";
import { NotificationsDrawer } from "../components/notifications-drawer";

import type { HeaderRightAreaProps } from "./types";

// ----------------------------------------------------------------------

export function HeaderRightArea({
  data,
  slots,
  signIn,
  account,
  helpLink,
  settings,
  searchbar,
  notifications,
}: HeaderRightAreaProps): ReactNode {
  return (
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
        {searchbar && <Searchbar data-slot="searchbar" data={data?.nav} />}

        {/* -- Notifications drawer (self-fetching) -- */}
        {notifications && <NotificationsDrawer data-slot="notifications" />}

        {/* -- Settings button -- */}
        {settings && <SettingsButton data-slot="settings" />}

        {/* -- Account drawer -- */}
        {account && <AccountDrawer data-slot="account" data={data?.account} />}

        {/* -- Sign in button -- */}
        {signIn && <SignInButton />}
      </Box>

      {slots?.rightAreaEnd}
    </>
  );
}
