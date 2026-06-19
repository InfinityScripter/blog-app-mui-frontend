import type { Theme, SxProps } from "@mui/material/styles";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { CONFIG } from "src/config-global";
import { useAuthContext } from "src/auth/hooks";
import Typography from "@mui/material/Typography";
import { varAlpha, bgGradient } from "src/theme/styles";
import { alpha as hexAlpha } from "@mui/material/styles";

import type { LayoutUserView } from "./types";

// ----------------------------------------------------------------------

export interface NavUpgradeProps {
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

export function NavUpgrade({ sx, ...other }: NavUpgradeProps) {
  const { user } = useAuthContext();

  // The auth `User` shape predates the Minimals UI fields (`photoURL`/
  // `displayName`); read through the layout's own optional view. See
  // `account-drawer.tsx` `LayoutUserView` and the SHARED-TYPE GAP note.
  const userView: LayoutUserView | null = user;

  return (
    <Stack sx={{ px: 2, py: 5, textAlign: "center", ...sx }} {...other}>
      <Stack alignItems="center">
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={userView?.photoURL}
            alt={userView?.displayName}
            sx={{ width: 48, height: 48 }}
          >
            {userView?.displayName?.charAt(0).toUpperCase()}
          </Avatar>
        </Box>

        <Stack spacing={0.5} sx={{ mb: 2, mt: 1.5, width: 1 }}>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{ color: "var(--layout-nav-text-primary-color)" }}
          >
            {userView?.displayName}
          </Typography>

          <Typography
            variant="body2"
            noWrap
            sx={{ color: "var(--layout-nav-text-disabled-color)" }}
          >
            {userView?.email}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

export interface UpgradeBlockProps {
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

export function UpgradeBlock({ sx, ...other }: UpgradeBlockProps) {
  return (
    <Stack
      sx={{
        ...bgGradient({
          color: `135deg, ${hexAlpha("#F7BB95", 0.92)}, ${hexAlpha("#5B2FF3", 0.92)}`,
          imgUrl: `${CONFIG.site.basePath}/assets/background/background-7.webp`,
        }),
        px: 3,
        py: 4,
        borderRadius: 2,
        position: "relative",
        ...sx,
      }}
      {...other}
    >
      <Box
        sx={{
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          borderRadius: 2,
          position: "absolute",
          border: (theme) =>
            `solid 3px ${varAlpha(theme.vars.palette.common.whiteChannel, 0.16)}`,
        }}
      />

      <Box
        component={m.img}
        animate={{
          transform: [
            "translateY(12px)",
            "translateY(-12px)",
            "translateY(12px)",
          ],
        }}
        transition={{
          duration: 8,
          ease: "linear",
          repeat: Infinity,
          repeatDelay: 0,
        }}
        alt="Small Rocket"
        src={`${CONFIG.site.basePath}/assets/illustrations/illustration-rocket-small.webp`}
        sx={{ right: 0, width: 112, height: 112, position: "absolute" }}
      />

      <Stack alignItems="flex-start" sx={{ position: "relative" }}>
        <Box component="span" sx={{ typography: "h5", color: "common.white" }}>
          35% OFF
        </Box>

        <Box
          component="span"
          sx={{
            mb: 2,
            mt: 0.5,
            color: "common.white",
            typography: "subtitle2",
          }}
        >
          Power up Productivity!
        </Box>

        <Button variant="contained" size="small" color="warning">
          Upgrade to Pro
        </Button>
      </Stack>
    </Stack>
  );
}
