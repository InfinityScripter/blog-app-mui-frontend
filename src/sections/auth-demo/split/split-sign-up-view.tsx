"use client";

import { useForm } from "react-hook-form";
import { Form } from "src/components/hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SignUpSchema } from "./split-sign-up-schema";
import { SplitSignUpHead } from "./split-sign-up-head";
import { SplitSignUpForm } from "./split-sign-up-form";
import { SplitSignUpTerms } from "./split-sign-up-terms";
import { SplitSignUpSocials } from "./split-sign-up-socials";

// ----------------------------------------------------------------------

export { SignUpSchema };

// ----------------------------------------------------------------------

export function SplitSignUpView() {
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
      <SplitSignUpHead />

      <Form methods={methods} onSubmit={onSubmit}>
        <SplitSignUpForm isSubmitting={isSubmitting} />
      </Form>

      <SplitSignUpTerms />

      <SplitSignUpSocials />
    </>
  );
}
