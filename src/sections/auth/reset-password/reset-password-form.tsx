import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { paths } from "src/routes/paths";
import Button from "@mui/material/Button";
import { Iconify } from "src/components/iconify";
import { Field } from "src/components/hook-form";
import { RouterLink } from "src/routes/components";

import { ResetPasswordFormProps } from "./types";

// ----------------------------------------------------------------------

export function ResetPasswordForm({
  error,
  success,
  isSubmitting,
}: ResetPasswordFormProps) {
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

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Отправка запроса..."
      >
        Отправить запрос
      </Button>

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
