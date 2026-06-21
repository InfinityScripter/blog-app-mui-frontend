"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useForm } from "react-hook-form";
import { varAlpha } from "src/theme/styles";
import { toast } from "src/components/snackbar";
import { Form } from "src/components/hook-form";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { useBoolean } from "src/hooks/use-boolean";
import { changePassword } from "src/actions/account";
import { zodResolver } from "@hookform/resolvers/zod";

import { PasswordField } from "./account-change-password-field";
import { defaultValues } from "./account-change-password-const";
import { Requirement } from "./account-change-password-requirement";
import { ChangePasswordSchema } from "./account-change-password-schema";

import type { ChangePasswordSchemaType } from "./types";

// ----------------------------------------------------------------------

export { ChangePasswordSchema };

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
              <PasswordField
                name="currentPassword"
                label="Текущий пароль"
                visible={showCurrentPassword}
              />
              <PasswordField
                name="newPassword"
                label="Новый пароль"
                visible={showNewPassword}
              />
              <PasswordField
                name="confirmNewPassword"
                label="Подтвердите новый пароль"
                visible={showConfirmPassword}
              />

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
