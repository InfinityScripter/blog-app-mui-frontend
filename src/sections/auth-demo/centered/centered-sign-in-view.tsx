"use client";

import { useForm } from "react-hook-form";
import { Form } from "src/components/hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SignInSchema } from "./sign-in-schema";
import { CenteredSignInLogo } from "./centered-sign-in-logo";
import { CenteredSignInHead } from "./centered-sign-in-head";
import { CenteredSignInForm } from "./centered-sign-in-form";
import { CenteredSignInSocials } from "./centered-sign-in-socials";

// ----------------------------------------------------------------------

export { SignInSchema };

// ----------------------------------------------------------------------

export function CenteredSignInView() {
  const defaultValues = { email: "", password: "" };

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
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.info("DATA", data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      <CenteredSignInLogo />

      <CenteredSignInHead />

      <Form methods={methods} onSubmit={onSubmit}>
        <CenteredSignInForm isSubmitting={isSubmitting} />
      </Form>

      <CenteredSignInSocials />
    </>
  );
}
