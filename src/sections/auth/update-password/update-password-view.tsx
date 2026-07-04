"use client";

import { useState } from "react";
import { paths } from "src/routes/paths";
import { useForm } from "react-hook-form";
import { Form } from "src/components/hook-form";
import axios, { endpoints } from "src/utils/axios";
import { zodResolver } from "@hookform/resolvers/zod";

import { UpdatePasswordHead } from "./update-password-head";
import { UpdatePasswordForm } from "./update-password-form";
import { UpdatePasswordSchema } from "./update-password-schema";

// ----------------------------------------------------------------------

export function UpdatePasswordView() {
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
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to update password. Please try again.",
      );
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <UpdatePasswordHead />
      <UpdatePasswordForm
        error={error}
        success={success}
        codeFromUrl={codeFromUrl}
        isSubmitting={isSubmitting}
      />
    </Form>
  );
}
