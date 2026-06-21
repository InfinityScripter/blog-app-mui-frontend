"use client";

import { useForm } from "react-hook-form";
import { Form } from "src/components/hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SignUpSchema } from "./sign-up-schema";
import { CenteredSignUpLogo } from "./centered-sign-up-logo";
import { CenteredSignUpHead } from "./centered-sign-up-head";
import { CenteredSignUpForm } from "./centered-sign-up-form";
import { CenteredSignUpTerms } from "./centered-sign-up-terms";
import { CenteredSignUpSocials } from "./centered-sign-up-socials";

// ----------------------------------------------------------------------

export { SignUpSchema };

// ----------------------------------------------------------------------

export function CenteredSignUpView() {
  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.info("DATA", data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      <CenteredSignUpLogo />

      <CenteredSignUpHead />

      <Form methods={methods} onSubmit={onSubmit}>
        <CenteredSignUpForm isSubmitting={isSubmitting} />
      </Form>

      <CenteredSignUpTerms />

      <CenteredSignUpSocials />
    </>
  );
}
