import { useCallback } from "react";
import Link from "@mui/material/Link";
import { useRouter } from "src/routes/hooks";
import { useAuthContext } from "src/auth/hooks";
import { signOutAllSessions } from "src/auth/context/jwt/action";

import type { SignOutButtonProps } from "./types";

// ----------------------------------------------------------------------
// Revokes EVERY active session for the user (all devices), not just this one —
// the visible counterpart to the server-side refresh-token revocation. Rendered
// as a subtle text link under the primary "Выйти" button.

export function SignOutEverywhereButton({ onClose }: SignOutButtonProps) {
  const router = useRouter();

  const { checkUserSession } = useAuthContext();

  const handleLogoutEverywhere = useCallback(async () => {
    try {
      await signOutAllSessions();
      await checkUserSession?.();

      onClose?.();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }, [checkUserSession, onClose, router]);

  return (
    <Link
      component="button"
      type="button"
      variant="caption"
      color="text.secondary"
      underline="always"
      onClick={handleLogoutEverywhere}
      sx={{ display: "block", mx: "auto", mt: 1.5 }}
    >
      Выйти на всех устройствах
    </Link>
  );
}
