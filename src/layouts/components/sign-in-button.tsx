import type { Theme, SxProps } from "@mui/material/styles";

import Button from "@mui/material/Button";
import { CONFIG } from "src/config-global";
import { RouterLink } from "src/routes/components";

// ----------------------------------------------------------------------

export interface SignInButtonProps {
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

export function SignInButton({ sx, ...other }: SignInButtonProps) {
  return (
    <Button
      component={RouterLink}
      href={CONFIG.auth.redirectPath}
      // Don't prefetch the heavy dashboard route from every public page header.
      prefetch={false}
      variant="outlined"
      sx={sx}
      {...other}
    >
      Вход
    </Button>
  );
}
