"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { paths } from "src/routes/paths";
import { useForm } from "react-hook-form";
import { Form } from "src/components/hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import axios, { endpoints } from "../../../utils/axios";
import { UpdatePasswordSchema } from "./update-password-schema";
import { CenteredUpdatePasswordHead } from "./centered-update-password-head";
import { CenteredUpdatePasswordForm } from "./centered-update-password-form";

// ----------------------------------------------------------------------

export { UpdatePasswordSchema };

// ----------------------------------------------------------------------

export function CenteredUpdatePasswordView() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Получаем параметры из URL
  const urlParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const emailFromUrl = urlParams.get("email") || "";
  const codeFromUrl = urlParams.get("code") || "";

  const defaultValues = {
    code: codeFromUrl,
    email: emailFromUrl,
    password: "",
    confirmPassword: "",
  };

  const methods = useForm({
    resolver: zodResolver(UpdatePasswordSchema),
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

      await axios.post(endpoints.auth.updatePassword, {
        email: data.email,
        code: data.code,
        password: data.password,
      });

      setSuccess("Password updated successfully!");

      // Redirect to login after short delay
      setTimeout(() => {
        window.location.href = paths.auth.jwt.signIn;
      }, 1500);
      // eslint-disable-next-line no-shadow
    } catch (error) {
      console.error("Error updating password:", error);
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      setError(message || "Failed to update password. Please try again.");
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <CenteredUpdatePasswordHead />
      <CenteredUpdatePasswordForm
        error={error}
        success={success}
        codeFromUrl={codeFromUrl}
        isSubmitting={isSubmitting}
      />
    </Form>
  );
}
