"use client";

import { useForm } from "react-hook-form";
import { Form } from "src/components/hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { UpdatePasswordSchema } from "./split-update-password-schema";
import { SplitUpdatePasswordHead } from "./split-update-password-head";
import { SplitUpdatePasswordForm } from "./split-update-password-form";

// ----------------------------------------------------------------------

export { UpdatePasswordSchema };

// ----------------------------------------------------------------------

export function SplitUpdatePasswordView() {
  const defaultValues = {
    code: "",
    email: "",
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.info("DATA", data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      <SplitUpdatePasswordHead />

      <Form methods={methods} onSubmit={onSubmit}>
        <SplitUpdatePasswordForm isSubmitting={isSubmitting} />
      </Form>
    </>
  );
}
