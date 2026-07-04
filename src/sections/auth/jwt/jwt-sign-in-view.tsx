"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import { useForm } from "react-hook-form";
import { useAuthContext } from "src/auth/hooks";
import { Iconify } from "src/components/iconify";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { RouterLink } from "src/routes/components";
import { useBoolean } from "src/hooks/use-boolean";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Field } from "src/components/hook-form";
import { signInWithPassword } from "src/auth/context/jwt";
import InputAdornment from "@mui/material/InputAdornment";
import { useRouter, useSearchParams } from "src/routes/hooks";

import { SignInSchema } from "./jwt-sign-in-schema";
import { JwtSignInSocial } from "./jwt-sign-in-social";

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { checkUserSession } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState("");
  const oauthError = searchParams.get("oauthError");

  const password = useBoolean();

  const defaultValues = {
    email: "",
    password: "",
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signInWithPassword({ email: data.email, password: data.password });
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      // Извлекаем сообщение об ошибке из ответа сервера, если оно есть
      const errorMessage =
        (isAxiosError(error)
          ? error.response?.data?.message
          : error instanceof Error
            ? error.message
            : undefined) || "Ошибка авторизации";
      setErrorMsg(errorMessage);
      console.error("Ошибка входа:", errorMessage);
    }
  });

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">Вход в аккаунт</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Нет аккаунта?
        </Typography>

        <Link
          component={RouterLink}
          href={paths.auth.jwt.signUp}
          variant="subtitle2"
        >
          Зарегистрироваться
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text
        name="email"
        label="Email адрес"
        InputLabelProps={{ shrink: true }}
      />

      <Stack spacing={1.5}>
        <Link
          component={RouterLink}
          href={paths.auth.resetPassword}
          variant="body2"
          color="inherit"
          sx={{ alignSelf: "flex-end" }}
        >
          Забыли пароль?
        </Link>

        <Field.Text
          name="password"
          label="Пароль"
          type={password.value ? "text" : "password"}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify
                    icon={
                      password.value
                        ? "solar:eye-bold"
                        : "solar:eye-closed-bold"
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Вход..."
      >
        Войти
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {!!oauthError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Не удалось выполнить OAuth-вход. Попробуйте ещё раз.
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <JwtSignInSocial />
    </>
  );
}
