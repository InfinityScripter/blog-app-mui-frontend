import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import { Iconify } from "src/components/iconify";
import { Field } from "src/components/hook-form";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { RouterLink } from "src/routes/components";
import { useBoolean } from "src/hooks/use-boolean";
import InputAdornment from "@mui/material/InputAdornment";

import type { SplitUpdatePasswordFormProps } from "./types";

// ----------------------------------------------------------------------

export function SplitUpdatePasswordForm({
  isSubmitting,
}: SplitUpdatePasswordFormProps) {
  const password = useBoolean();

  return (
    <Stack spacing={3}>
      <Field.Text
        name="email"
        label="Email address"
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
      />

      <Field.Code name="code" />

      <Field.Text
        name="password"
        label="Password"
        placeholder="6+ characters"
        type={password.value ? "text" : "password"}
        InputLabelProps={{ shrink: true }}
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
        label="Confirm new password"
        type={password.value ? "text" : "password"}
        InputLabelProps={{ shrink: true }}
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

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Update password..."
      >
        Update password
      </LoadingButton>

      <Typography variant="body2" sx={{ mx: "auto" }}>
        {`Don’t have a code? `}
        <Link variant="subtitle2" sx={{ cursor: "pointer" }}>
          Resend code
        </Link>
      </Typography>

      <Link
        component={RouterLink}
        href={paths.auth.jwt.signIn}
        color="inherit"
        variant="subtitle2"
        sx={{ mx: "auto", alignItems: "center", display: "inline-flex" }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} sx={{ mr: 0.5 }} />
        Return to sign in
      </Link>
    </Stack>
  );
}
