import Stack from "@mui/material/Stack";
import { Iconify } from "src/components/iconify";
import { Field } from "src/components/hook-form";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import { useBoolean } from "src/hooks/use-boolean";
import InputAdornment from "@mui/material/InputAdornment";

import { CenteredSignUpFormProps } from "./types";

// ----------------------------------------------------------------------

export function CenteredSignUpForm({ isSubmitting }: CenteredSignUpFormProps) {
  const password = useBoolean();

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Field.Text
          name="firstName"
          label="First name"
          InputLabelProps={{ shrink: true }}
        />
        <Field.Text
          name="lastName"
          label="Last name"
          InputLabelProps={{ shrink: true }}
        />
      </Stack>

      <Field.Text
        name="email"
        label="Email address"
        InputLabelProps={{ shrink: true }}
      />

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

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Create account..."
      >
        Create account
      </LoadingButton>
    </Stack>
  );
}
