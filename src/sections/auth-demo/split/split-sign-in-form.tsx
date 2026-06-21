import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { Field } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import { RouterLink } from "src/routes/components";
import { useBoolean } from "src/hooks/use-boolean";
import InputAdornment from "@mui/material/InputAdornment";

import { authDemoPaths } from "../paths";

import type { SplitSignInFormProps } from "./types";

// ----------------------------------------------------------------------

export function SplitSignInForm({ isSubmitting }: SplitSignInFormProps) {
  const password = useBoolean();

  return (
    <Stack spacing={3}>
      <Field.Text
        name="email"
        label="Email address"
        InputLabelProps={{ shrink: true }}
      />

      <Stack spacing={1.5}>
        <Link
          component={RouterLink}
          href={authDemoPaths.split.resetPassword}
          variant="body2"
          color="inherit"
          sx={{ alignSelf: "flex-end" }}
        >
          Forgot password?
        </Link>

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
                      password.value
                        ? "solar:eye-bold"
                        : "solar:eye-closed-bold"
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Sign in..."
      >
        Sign in
      </LoadingButton>
    </Stack>
  );
}
