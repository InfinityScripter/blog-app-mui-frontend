import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { paths } from "src/routes/paths";
import { Iconify } from "src/components/iconify";
import { Field } from "src/components/hook-form";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import { RouterLink } from "src/routes/components";
import { useBoolean } from "src/hooks/use-boolean";
import InputAdornment from "@mui/material/InputAdornment";

import { CenteredUpdatePasswordFormProps } from "./types";

// ----------------------------------------------------------------------

export function CenteredUpdatePasswordForm({
  error,
  success,
  codeFromUrl,
  isSubmitting,
}: CenteredUpdatePasswordFormProps) {
  const password = useBoolean();

  return (
    <Stack spacing={3}>
      <Field.Text
        name="email"
        label="Email address"
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
        disabled
      />

      <Field.Code name="code" defaultValue={codeFromUrl} />

      <Field.Text
        name="password"
        label="New Password"
        type={password.value ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify
                  icon={
                    password.value ? "solar:eye-bold" : "solar:eye-closed-bold"
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Field.Text
        name="confirmPassword"
        label="Confirm New Password"
        type={password.value ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify
                  icon={
                    password.value ? "solar:eye-bold" : "solar:eye-closed-bold"
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Update Password
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.auth.jwt.signIn}
        color="inherit"
        variant="subtitle2"
        sx={{
          mt: 3,
          mx: "auto",
          alignItems: "center",
          display: "inline-flex",
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Return to sign in
      </Link>
    </Stack>
  );
}
