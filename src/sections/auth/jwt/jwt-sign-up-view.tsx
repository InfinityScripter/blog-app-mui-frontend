"use client";

import { useState } from "react";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import { useForm } from "react-hook-form";
import { useRouter } from "src/routes/hooks";
import { signUp } from "src/auth/context/jwt";
import { Form } from "src/components/hook-form";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";
import { zodResolver } from "@hookform/resolvers/zod";

import { JwtSignUpForm } from "./jwt-sign-up-form";
import { SignUpSchema } from "./jwt-sign-up-schema";
import { JwtSignUpTerms } from "./jwt-sign-up-terms";
import { JwtSignUpSocial } from "./jwt-sign-up-social";

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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
      setErrorMsg("");
      await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      setSuccessMsg("Код подтверждения отправлен на email");
      router.push(
        `${paths.auth.verify}?email=${encodeURIComponent(data.email)}`,
      );
    } catch (error) {
      console.error(error);
      setErrorMsg(error instanceof Error ? error.message : String(error));
    }
  });

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">Начните абсолютно бесплатно</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Уже есть аккаунт?
        </Typography>

        <Link
          component={RouterLink}
          href={paths.auth.jwt.signIn}
          variant="subtitle2"
        >
          Войти
        </Link>
      </Stack>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {!!successMsg && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <JwtSignUpForm isSubmitting={isSubmitting} />
      </Form>

      <JwtSignUpSocial />

      <JwtSignUpTerms />
    </>
  );
}
