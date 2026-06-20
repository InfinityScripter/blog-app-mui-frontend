import type { Theme, SxProps } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { useAuthContext } from "src/auth/hooks";
import Typography from "@mui/material/Typography";

import type { LayoutUserView } from "./types";

// ----------------------------------------------------------------------

export interface NavUpgradeProps {
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

export function NavUpgrade({ sx, ...other }: NavUpgradeProps) {
  const { user } = useAuthContext();

  // Map the auth `User` (`name`/`avatarURL`) onto the layout's Minimals-era
  // view fields (`displayName`/`photoURL`) so the real avatar/name render.
  const userView: LayoutUserView | null = user
    ? {
        displayName: user.name,
        email: user.email,
        photoURL: user.avatarURL,
      }
    : null;

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
