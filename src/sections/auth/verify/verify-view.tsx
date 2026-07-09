"use client";

import { useState } from "react";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { paths } from "src/routes/paths";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { EmailInboxIcon } from "src/assets/icons";
import { RouterLink } from "src/routes/components";
import axios, { endpoints } from "src/utils/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Field } from "src/components/hook-form";
import { useRouter, useSearchParams } from "next/navigation";

import { VerifySchema } from "./verify-schema";

// ----------------------------------------------------------------------

export function VerifyView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const defaultValues = {
    code: code || "",
    email: searchParams.get("email") || "",
  };

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
      setError("");
      setSuccess("");

      const response = await axios.post<{ message?: string }>(
        endpoints.auth.verify,
        { email: data.email, code: data.code },
      );

      setSuccess(response.data.message || "Email verified successfully!");

      // Redirect to dashboard after successful verification
      setTimeout(() => {
        router.push(paths.dashboard.root);
      }, 2000);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to verify email",
      );
    }
  });

  const handleResendCode = async () => {
    try {
      setError("");
      setSuccess("");

      const response = await axios.post<{ message?: string }>(
        endpoints.auth.resendVerification,
        { email: methods.getValues("email") },
      );

      setSuccess(
        response.data.message || "Verification code resent successfully!",
      );
    } catch (resendError) {
      setError(
        resendError instanceof Error
          ? resendError.message
          : "Failed to resend code",
      );
    }
  };

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <EmailInboxIcon sx={{ height: 96 }} />

      <Stack spacing={1}>
        <Typography variant="h3">Please verify your email!</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          We have sent a 6-digit confirmation code to your email. Please enter
          the code below to verify your email address.
        </Typography>
      </Stack>

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          <Field.Text
            name="email"
            label="Email"
            placeholder="example@domain.com"
            InputLabelProps={{ shrink: true }}
          />

          <Field.Code name="code" />

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Verify
          </Button>

          <Typography variant="body2" align="center">
            {`Don't have a code? `}
            <Link
              variant="subtitle2"
              onClick={handleResendCode}
              sx={{
                cursor: "pointer",
              }}
            >
              Resend code
            </Link>
          </Typography>

          <Link
            component={RouterLink}
            href={paths.dashboard.root}
            color="inherit"
            variant="subtitle2"
            sx={{
              mt: 3,
              mx: "auto",
              alignItems: "center",
              display: "inline-flex",
            }}
          >
            <Iconify icon="eva:chevron-left-fill" width={16} />
            Return to Dashboard
          </Link>
        </Stack>
      </Form>
    </Stack>
  );
}
