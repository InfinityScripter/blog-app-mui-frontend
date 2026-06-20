"use client";

import { z as zod } from "zod";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useForm } from "react-hook-form";
import { varAlpha } from "src/theme/styles";
import { toast } from "src/components/snackbar";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import { useBoolean } from "src/hooks/use-boolean";
import { changePassword } from "src/actions/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Field } from "src/components/hook-form";
import InputAdornment from "@mui/material/InputAdornment";

// ----------------------------------------------------------------------

export const ChangePasswordSchema = zod
  .object({
    currentPassword: zod
      .string()
      .min(1, { message: "Текущий пароль обязателен!" }),
    newPassword: zod
      .string()
      .min(1, { message: "Новый пароль обязателен!" })
      .min(6, { message: "Пароль должен содержать не менее 6 символов!" }),
    confirmNewPassword: zod
      .string()
      .min(1, { message: "Подтвердите новый пароль!" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Пароли не совпадают!",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Новый пароль должен отличаться от текущего!",
    path: ["newPassword"],
  });

type ChangePasswordSchemaType = zod.infer<typeof ChangePasswordSchema>;

// ----------------------------------------------------------------------

const defaultValues: ChangePasswordSchemaType = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

// ----------------------------------------------------------------------

function Requirement({ ok, children }: { ok: boolean; children: string }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        typography: "body2",
        color: ok ? "success.main" : "text.secondary",
        transition: (theme) => theme.transitions.create("color"),
      }}
    >
      <Iconify
        width={18}
        icon={ok ? "solar:check-circle-bold" : "solar:close-circle-linear"}
        sx={{ flexShrink: 0, color: ok ? "success.main" : "text.disabled" }}
      />
      {children}
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function AccountChangePassword() {
  const showCurrentPassword = useBoolean();
  const showNewPassword = useBoolean();
  const showConfirmPassword = useBoolean();

  const methods = useForm<ChangePasswordSchemaType>({
    mode: "all",
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // Live requirement checks that tick green as the user types.
  const reqLength = values.newPassword.length >= 6;
  const reqDifferent =
    values.newPassword.length > 0 &&
    values.newPassword !== values.currentPassword;
  const reqMatch =
    values.confirmNewPassword.length > 0 &&
    values.newPassword === values.confirmNewPassword;

  const renderPasswordField = (
    name: keyof ChangePasswordSchemaType,
    label: string,
    visible: ReturnType<typeof useBoolean>,
  ) => (
    <Field.Text
      name={name}
      label={label}
      type={visible.value ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={visible.onToggle} edge="end">
              <Iconify
                icon={
                  visible.value ? "solar:eye-bold" : "solar:eye-closed-bold"
                }
              />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      reset();
      toast.success("Пароль успешно изменён!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось изменить пароль";

      // The backend returns 400 with a message when the current password is
      // wrong. Surface it on the field and as a toast.
      setError("currentPassword", { type: "server", message });
      toast.error(message);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: { xs: 3, md: 4 } }}>
        <Grid container spacing={{ xs: 3, md: 5 }}>
          {/* Left: context + live requirements. */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  color: "primary.main",
                  bgcolor: (theme) =>
                    varAlpha(theme.vars.palette.primary.mainChannel, 0.12),
                }}
              >
                <Iconify width={24} icon="solar:lock-keyhole-bold" />
              </Box>

              <Typography variant="h6">Смена пароля</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Используйте надёжный пароль, который вы не используете на других
                сайтах.
              </Typography>

              <Stack spacing={1} sx={{ mt: 1 }}>
                <Requirement ok={reqLength}>Не менее 6 символов</Requirement>
                <Requirement ok={reqDifferent}>
                  Отличается от текущего
                </Requirement>
                <Requirement ok={reqMatch}>Пароли совпадают</Requirement>
              </Stack>
            </Stack>
          </Grid>

          {/* Right: the form fields. */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={3}>
              {renderPasswordField(
                "currentPassword",
                "Текущий пароль",
                showCurrentPassword,
              )}
              {renderPasswordField(
                "newPassword",
                "Новый пароль",
                showNewPassword,
              )}
              {renderPasswordField(
                "confirmNewPassword",
                "Подтвердите новый пароль",
                showConfirmPassword,
              )}

              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                startIcon={<Iconify icon="solar:lock-password-bold" />}
                sx={{ ml: "auto" }}
              >
                Изменить пароль
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Form>
  );
}
