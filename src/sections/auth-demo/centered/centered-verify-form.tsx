import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { Iconify } from "src/components/iconify";
import { Field } from "src/components/hook-form";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { RouterLink } from "src/routes/components";

import { authDemoPaths } from "../paths";
import { CenteredVerifyFormProps } from "./types";

// ----------------------------------------------------------------------

export function CenteredVerifyForm({ isSubmitting }: CenteredVerifyFormProps) {
  return (
    <Stack spacing={3}>
      <Field.Text
        name="email"
        label="Email address"
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
      />

      <Field.Code name="code" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Verify..."
      >
        Verify
      </LoadingButton>

      <Typography variant="body2" sx={{ mx: "auto" }}>
        {`Don’t have a code? `}
        <Link variant="subtitle2" sx={{ cursor: "pointer" }}>
          Resend code
        </Link>
      </Typography>

      <Link
        component={RouterLink}
        href={authDemoPaths.centered.signIn}
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
