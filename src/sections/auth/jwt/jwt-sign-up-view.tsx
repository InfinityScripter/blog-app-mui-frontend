"use client";

import { z as zod } from "zod";
import { useState } from "react";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import Divider from "@mui/material/Divider";
import { useRouter } from "src/routes/hooks";
import { Iconify } from "src/components/iconify";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { RouterLink } from "src/routes/components";
import { useBoolean } from "src/hooks/use-boolean";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Field } from "src/components/hook-form";
import InputAdornment from "@mui/material/InputAdornment";
import {
  signUp,
  signInWithGoogle,
  signInWithYandex,
} from "src/auth/context/jwt";

// ----------------------------------------------------------------------

export const SignUpSchema = zod.object({
  firstName: zod.string().min(1, { message: "Имя обязательно!" }),
  lastName: zod.string().min(1, { message: "Фамилия обязательна!" }),
  email: zod.string().min(1, { message: "Email обязателен!" }).email({
    message: "Email должен быть действительным адресом электронной почты!",
  }),
  password: zod
    .string()
    .min(1, { message: "Пароль обязателен!" })
    .min(6, { message: "Пароль должен содержать не менее 6 символов!" }),
});

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const router = useRouter();

  const password = useBoolean();

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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
      setErrorMsg("");
      await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      setSuccessMsg("Код подтверждения отправлен на email");
      router.push(
        `${paths.auth.verify}?email=${encodeURIComponent(data.email)}`,
      );
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

  const renderSocialSignUp = (
    <>
      <Divider
        sx={{
          my: 3,
          typography: "overline",
          color: "text.disabled",
          "&::before, :after": { borderTopStyle: "dashed" },
        }}
      >
        ИЛИ
      </Divider>

      <Stack spacing={1.5}>
        <Button
          fullWidth
          size="large"
          variant="outlined"
          startIcon={<Iconify icon="flat-color-icons:google" />}
          onClick={signInWithGoogle}
        >
          Продолжить через Google
        </Button>

        <Button
          fullWidth
          size="large"
          variant="outlined"
          startIcon={<Iconify icon="simple-icons:yandex" />}
          onClick={signInWithYandex}
        >
          Продолжить через Yandex ID
        </Button>
      </Stack>
    </>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {!!successMsg && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      {renderSocialSignUp}

      {renderTerms}
    </>
  );
}
