"use client";

import { useForm } from "react-hook-form";
import { Form } from "src/components/hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SignInSchema } from "./split-sign-in-schema";
import { SplitSignInHead } from "./split-sign-in-head";
import { SplitSignInForm } from "./split-sign-in-form";
import { SplitSignInSocials } from "./split-sign-in-socials";

// ----------------------------------------------------------------------

export { SignInSchema };

// ----------------------------------------------------------------------

export function SplitSignInView() {
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
      <SplitSignInHead />

      <Form methods={methods} onSubmit={onSubmit}>
        <SplitSignInForm isSubmitting={isSubmitting} />
      </Form>

      <SplitSignInSocials />
    </>
  );
}
