"use client";

import { z as zod } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { PasswordIcon } from "src/assets/icons";

import { Iconify } from "src/components/iconify";
import { Form, Field } from "src/components/hook-form";

import axios, { endpoints } from "../../../utils/axios";

// ----------------------------------------------------------------------

export const ResetPasswordSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: "Email обязателен!" })
    .email({ message: "Email должен быть действительным адресом электронной почты!" }),
});

// ----------------------------------------------------------------------

export function CenteredResetPasswordView() {
  const defaultValues = { email: "" };
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const methods = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log(data, "data");
    try {
      setError("");
      setSuccess("");

      const response = await axios.post(endpoints.auth.resetPassword, {
        email: data.email,
      });

      setSuccess(
        response.data.message ||
          "Инструкции по сбросу пароля были отправлены на ваш email",
      );
      // eslint-disable-next-line no-shadow
    } catch (error) {
      console.error("Ошибка сброса пароля:", error);
      setError(error.message || "Не удалось отправить email для сброса пароля");
    }
  });

  const renderHead = (
    <>
      <PasswordIcon sx={{ mx: "auto" }} />

      <Stack
        spacing={1}
        sx={{ mt: 3, mb: 5, textAlign: "center", whiteSpace: "pre-line" }}
      >
        <Typography variant="h5">Забыли пароль?</Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {`Пожалуйста, введите email-адрес, связанный с вашей учетной записью, и мы отправим вам ссылку для сброса пароля.`}
        </Typography>
      </Stack>
    </>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text
        name="email"
        label="Email адрес"
        placeholder="example@gmail.com"
        autoFocus
        InputLabelProps={{ shrink: true }}
      />
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Отправка запроса..."
      >
        Отправить запрос
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.auth.jwt.signIn}
        color="inherit"
        variant="subtitle2"
        sx={{ mx: "auto", alignItems: "center", display: "inline-flex" }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} sx={{ mr: 0.5 }} />
        Вернуться к входу
      </Link>
    </Stack>
  );

  return (
    <>
      {renderHead}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
