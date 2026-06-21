import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { paths } from "src/routes/paths";
import { Iconify } from "src/components/iconify";
import { Field } from "src/components/hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import { RouterLink } from "src/routes/components";

import { CenteredResetPasswordFormProps } from "./types";

// ----------------------------------------------------------------------

export function CenteredResetPasswordForm({
  error,
  success,
  isSubmitting,
}: CenteredResetPasswordFormProps) {
  return (
    <Stack spacing={3}>
      <Field.Text
        name="email"
        label="Email адрес"
        placeholder="example@gmail.com"
        autoFocus
        InputLabelProps={{ shrink: true }}
      />
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Отправка запроса..."
      >
        Отправить запрос
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.auth.jwt.signIn}
        color="inherit"
        variant="subtitle2"
        sx={{ mx: "auto", alignItems: "center", display: "inline-flex" }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} sx={{ mr: 0.5 }} />
        Вернуться к входу
      </Link>
    </Stack>
  );
}
