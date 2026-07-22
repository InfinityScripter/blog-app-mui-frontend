"use client";

import { z as zod } from "zod";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { useRouter } from "src/routes/hooks";
import { Form } from "src/components/hook-form";
import Typography from "@mui/material/Typography";
import { useRef, useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { completeOAuthConsent } from "src/auth/context/jwt";

import { JwtSignUpTerms } from "./jwt-sign-up-terms";

const OAuthConsentSchema = zod.object({
  personalDataConsent: zod.boolean().refine(Boolean, {
    message: "Подтвердите согласие на обработку персональных данных",
  }),
});

export function OAuthConsentView() {
  const router = useRouter();
  const capturedTokenRef = useRef<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const methods = useForm({
    resolver: zodResolver(OAuthConsentSchema),
    defaultValues: { personalDataConsent: false },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (!capturedTokenRef.current) {
      const params = new URLSearchParams(window.location.hash.slice(1));
      capturedTokenRef.current = params.get("token");
    }
    setToken(capturedTokenRef.current);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`,
    );
    setReady(true);
  }, []);

  const onSubmit = handleSubmit(async () => {
    if (!token) return;
    try {
      setErrorMessage("");
      await completeOAuthConsent(token);
      router.replace(paths.auth.success);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Не удалось сохранить согласие",
      );
    }
  });

  if (!ready) {
    return <Typography>Проверяем ссылку...</Typography>;
  }

  if (!token) {
    return (
      <Alert severity="error">
        Ссылка недействительна. Начните OAuth-вход заново.
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography component="h1" variant="h5">
          Завершение регистрации
        </Typography>
        <Typography variant="body2" color="text.secondary">
          OAuth-провайдер подтвердил ваш email. Аккаунт будет создан только
          после отдельного согласия.
        </Typography>
      </Stack>

      {!!errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          <JwtSignUpTerms />
          <Button
            fullWidth
            type="submit"
            size="large"
            variant="contained"
            loading={isSubmitting}
          >
            Принять и продолжить
          </Button>
        </Stack>
      </Form>
    </Stack>
  );
}
