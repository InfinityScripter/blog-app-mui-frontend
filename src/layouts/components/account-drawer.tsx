"use client";

import type { ReactNode } from "react";
import type { Theme, SxProps } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import Drawer from "@mui/material/Drawer";
import { varAlpha } from "src/theme/styles";
import { Label } from "src/components/label";
import { useState, useCallback } from "react";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import { useAuthContext } from "src/auth/hooks";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Scrollbar } from "src/components/scrollbar";
import { AnimateAvatar } from "src/components/animate";
import { useRouter, usePathname } from "src/routes/hooks";
import { formatImageUrl } from "src/utils/format-image-url";

import { AccountButton } from "./account-button";
import { SignOutButton } from "./sign-out-button";

import type { LayoutUserView } from "./types";

// ----------------------------------------------------------------------

export interface AccountDrawerItem {
  label: string;
  href: string;
  icon: ReactNode;
  info?: ReactNode;
}

/**
 * The fields the account UI reads off the authenticated user. The auth `User`
 * type (`src/types/domain.ts`) predates these Minimals-era aliases
 * (`photoURL`/`displayName`), so the layout describes its own optional view.
 * The hook's `user` (`User & { accessToken?; role? } | null`) is assignable to
 * it because every field here is optional. See the SHARED-TYPE GAP report.
 */

export interface AccountDrawerProps {
  data?: AccountDrawerItem[];
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

export function AccountDrawer({ data = [], sx, ...other }: AccountDrawerProps) {
  const theme = useTheme();

  const router = useRouter();

  const pathname = usePathname();

  const { user } = useAuthContext();

  // The auth `User` (`src/types/domain.ts`) exposes `name`/`avatarURL`, while the
  // layout reads the Minimals-era `displayName`/`photoURL`. Map at the read site
  // so a real (incl. Google/Yandex) avatar and name actually render.
  const userView: LayoutUserView | null = user
    ? {
        displayName: user.name,
        email: user.email,
        // avatarURL is a relative backend path (/api/file/:id); resolve it to an
        // absolute URL so the <img> hits the API, not the frontend origin.
        photoURL: formatImageUrl(user.avatarURL),
      }
    : null;

  const [open, setOpen] = useState(false);

  const handleOpenDrawer = useCallback(() => {
    setOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setOpen(false);
  }, []);

  const handleClickItem = useCallback(
    (path: string) => {
      handleCloseDrawer();
      router.push(path);
    },
    [handleCloseDrawer, router],
  );

  const renderAvatar = (
    <AnimateAvatar
      width={96}
      slotProps={{
        avatar: { src: userView?.photoURL, alt: userView?.displayName },
        overlay: {
          border: 2,
          spacing: 3,
          color: `linear-gradient(135deg, ${varAlpha(theme.vars.palette.primary.mainChannel, 0)} 25%, ${theme.vars.palette.primary.main} 100%)`,
        },
      }}
    >
      {userView?.displayName?.charAt(0).toUpperCase()}
    </AnimateAvatar>
  );

  return (
    <>
      <AccountButton
        open={open}
        onClick={handleOpenDrawer}
        photoURL={userView?.photoURL}
        displayName={userView?.displayName}
        sx={sx}
        {...other}
      />

      <Drawer
        open={open}
        onClose={handleCloseDrawer}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320 } }}
      >
        <IconButton
          onClick={handleCloseDrawer}
          sx={{ top: 12, left: 12, zIndex: 9, position: "absolute" }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>

        <Scrollbar>
          <Stack alignItems="center" sx={{ pt: 8 }}>
            {renderAvatar}

            <Typography variant="subtitle1" noWrap sx={{ mt: 2 }}>
              {userView?.displayName}
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 0.5 }}
              noWrap
            >
              {userView?.email}
            </Typography>
          </Stack>

          <Stack
            sx={{
              mt: 3,
              py: 3,
              px: 2.5,
              borderTop: `dashed 1px ${theme.vars.palette.divider}`,
              borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
            }}
          >
            {data.map((option) => {
              // The first item is the dynamic root link: inside the dashboard it
              // points "home" to the public site, elsewhere it points to the
              // dashboard.
              const isRoot = option.href === "/";

              const rootLabel = pathname.includes("/dashboard")
                ? "Главная"
                : "Дашборд";

              const rootHref = pathname.includes("/dashboard")
                ? "/"
                : paths.dashboard.root;

              return (
                <MenuItem
                  key={option.label}
                  onClick={() =>
                    handleClickItem(isRoot ? rootHref : option.href)
                  }
                  sx={{
                    py: 1,
                    color: "text.secondary",
                    "& svg": { width: 24, height: 24 },
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  {option.icon}

                  <Box component="span" sx={{ ml: 2 }}>
                    {isRoot ? rootLabel : option.label}
                  </Box>

                  {option.info && (
                    <Label color="error" sx={{ ml: 1 }}>
                      {option.info}
                    </Label>
                  )}
                </MenuItem>
              );
            })}
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <SignOutButton onClose={handleCloseDrawer} />
        </Box>
      </Drawer>
    </>
  );
}
