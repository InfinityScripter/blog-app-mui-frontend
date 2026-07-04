"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "src/components/hook-form";
import axios, { endpoints } from "src/utils/axios";
import { zodResolver } from "@hookform/resolvers/zod";

import { ResetPasswordHead } from "./reset-password-head";
import { ResetPasswordForm } from "./reset-password-form";
import { ResetPasswordSchema } from "./reset-password-schema";

// ----------------------------------------------------------------------

export function ResetPasswordView() {
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
    try {
      setError("");
      setSuccess("");

      const response = await axios.post<{ message?: string }>(
        endpoints.auth.resetPassword,
        { email: data.email },
      );

      setSuccess(
        response.data.message ||
          "Инструкции по сбросу пароля были отправлены на ваш email",
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Не удалось отправить email для сброса пароля",
      );
    }
  });

  return (
    <>
      <ResetPasswordHead />

      <Form methods={methods} onSubmit={onSubmit}>
        <ResetPasswordForm
          error={error}
          success={success}
          isSubmitting={isSubmitting}
        />
      </Form>
    </>
  );
}
