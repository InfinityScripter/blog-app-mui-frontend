"use client";

import { useForm } from "react-hook-form";
import { Form } from "src/components/hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { VerifySchema } from "./verify-schema";
import { CenteredVerifyHead } from "./centered-verify-head";
import { CenteredVerifyForm } from "./centered-verify-form";

// ----------------------------------------------------------------------

export { VerifySchema };

// ----------------------------------------------------------------------

export function CenteredVerifyView() {
  const defaultValues = { code: "", email: "" };

  const methods = useForm({
    resolver: zodResolver(VerifySchema),
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
      <CenteredVerifyHead />

      <Form methods={methods} onSubmit={onSubmit}>
        <CenteredVerifyForm isSubmitting={isSubmitting} />
      </Form>
    </>
  );
}
