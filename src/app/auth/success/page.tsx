"use client";

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import { CONFIG } from "src/config-global";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import { useAuthContext } from "src/auth/hooks";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { checkUserSession } = useAuthContext();

  useEffect(() => {
    // The OAuth callback already set the auth cookies before redirecting here —
    // there is no token in the URL. Just confirm the session via /me and go.
    const bootstrapSession = async () => {
      try {
        await checkUserSession();
        router.replace(CONFIG.auth.redirectPath || paths.dashboard.root);
      } catch {
        setError("Не удалось завершить авторизацию");
      }
    };

    bootstrapSession();
  }, [router, checkUserSession]);

  return (
    <Container sx={{ py: 10 }}>
      <Stack spacing={2} alignItems="center" justifyContent="center">
        {!error ? (
          <>
            <CircularProgress />
            <Typography>Завершаем вход...</Typography>
          </>
        ) : (
          <Alert severity="error">{error}</Alert>
        )}
      </Stack>
    </Container>
  );
}
