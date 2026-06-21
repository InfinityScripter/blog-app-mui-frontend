"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "src/components/hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import axios, { endpoints } from "../../../utils/axios";
import { ResetPasswordSchema } from "./reset-password-schema";
import { CenteredResetPasswordHead } from "./centered-reset-password-head";
import { CenteredResetPasswordForm } from "./centered-reset-password-form";

// ----------------------------------------------------------------------

export { ResetPasswordSchema };

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
      setError(
        error instanceof Error
          ? error.message
          : "Не удалось отправить email для сброса пароля",
      );
    }
  });

  return (
    <>
      <CenteredResetPasswordHead />

      <Form methods={methods} onSubmit={onSubmit}>
        <CenteredResetPasswordForm
          error={error}
          success={success}
          isSubmitting={isSubmitting}
        />
      </Form>
    </>
  );
}
