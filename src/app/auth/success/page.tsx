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
import { setSession } from "src/auth/context/jwt";
import CircularProgress from "@mui/material/CircularProgress";

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { checkUserSession } = useAuthContext();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setError("OAuth token is missing");
      return;
    }

    const bootstrapSession = async () => {
      try {
        await setSession(token);
        await checkUserSession();
        router.replace(CONFIG.auth.redirectPath || paths.dashboard.root);
      } catch (e) {
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
