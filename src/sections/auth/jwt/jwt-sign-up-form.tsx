import Stack from "@mui/material/Stack";
import { Field } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import { useBoolean } from "src/hooks/use-boolean";
import InputAdornment from "@mui/material/InputAdornment";

// ----------------------------------------------------------------------

type Props = {
  isSubmitting: boolean;
};

export function JwtSignUpForm({ isSubmitting }: Props) {
  const password = useBoolean();

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Field.Text
          name="firstName"
          label="Имя"
          InputLabelProps={{ shrink: true }}
        />
        <Field.Text
          name="lastName"
          label="Фамилия"
          InputLabelProps={{ shrink: true }}
        />
      </Stack>

      <Field.Text
        name="email"
        label="Email адрес"
        InputLabelProps={{ shrink: true }}
      />

      <Field.Text
        name="password"
        label="Пароль"
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
        loadingIndicator="Создание аккаунта..."
      >
        Создать аккаунт
      </LoadingButton>
    </Stack>
  );
}
