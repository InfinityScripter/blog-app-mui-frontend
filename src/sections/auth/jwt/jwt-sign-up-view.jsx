"use client";

import { z as zod } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

import { useBoolean } from "src/hooks/use-boolean";

import { Iconify } from "src/components/iconify";
import { Form, Field } from "src/components/hook-form";

import { signUp } from "src/auth/context/jwt";
import { useAuthContext } from "src/auth/hooks";

// ----------------------------------------------------------------------

export const SignUpSchema = zod.object({
  firstName: zod.string().min(1, { message: "Имя обязательно!" }),
  lastName: zod.string().min(1, { message: "Фамилия обязательна!" }),
  email: zod
    .string()
    .min(1, { message: "Email обязателен!" })
    .email({ message: "Email должен быть действительным адресом электронной почты!" }),
  password: zod
    .string()
    .min(1, { message: "Пароль обязателен!" })
    .min(6, { message: "Пароль должен содержать не менее 6 символов!" }),
});

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const { checkUserSession } = useAuthContext();

  const router = useRouter();

  const password = useBoolean();

  const [errorMsg, setErrorMsg] = useState("");

  const defaultValues = {
    firstName: "Hello",
    lastName: "Friend",
    email: "hello@gmail.com",
    password: "@demo1",
  };

  const methods = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(error instanceof Error ? error.message : error);
    }
  });

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">Начните абсолютно бесплатно</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Уже есть аккаунт?
        </Typography>

        <Link
          component={RouterLink}
          href={paths.auth.jwt.signIn}
          variant="subtitle2"
        >
          Войти
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Field.Text
          name="firstName"
          label="Имя"
          InputLabelProps={{ shrink: true }}
        />
        <Field.Text
          name="lastName"
          label="Фамилия"
          InputLabelProps={{ shrink: true }}
        />
      </Stack>

      <Field.Text
        name="email"
        label="Email адрес"
        InputLabelProps={{ shrink: true }}
      />

      <Field.Text
        name="password"
        label="Пароль"
        placeholder="Не менее 6 символов"
        type={password.value ? "text" : "password"}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify
                  icon={
                    password.value ? "solar:eye-bold" : "solar:eye-closed-bold"
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Создание аккаунта..."
      >
        Создать аккаунт
      </LoadingButton>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        mt: 3,
        textAlign: "center",
        typography: "caption",
        color: "text.secondary",
      }}
    >
      {"Регистрируясь, я соглашаюсь с "}
      <Link underline="always" color="text.primary">
        Условиями использования
      </Link>
      {" и "}
      <Link underline="always" color="text.primary">
        Политикой конфиденциальности
      </Link>
      .
    </Typography>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      {renderTerms}
    </>
  );
}
