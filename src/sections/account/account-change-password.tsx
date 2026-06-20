"use client";

import { z as zod } from "zod";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { useForm } from "react-hook-form";
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
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

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
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Смена пароля
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
          Используйте надёжный пароль, который вы не используете на других
          сайтах.
        </Typography>

        <Stack spacing={3} sx={{ maxWidth: 480 }}>
          <Field.Text
            name="currentPassword"
            label="Текущий пароль"
            type={showCurrentPassword.value ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showCurrentPassword.onToggle} edge="end">
                    <Iconify
                      icon={
                        showCurrentPassword.value
                          ? "solar:eye-bold"
                          : "solar:eye-closed-bold"
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Field.Text
            name="newPassword"
            label="Новый пароль"
            type={showNewPassword.value ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showNewPassword.onToggle} edge="end">
                    <Iconify
                      icon={
                        showNewPassword.value
                          ? "solar:eye-bold"
                          : "solar:eye-closed-bold"
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText="Пароль должен содержать не менее 6 символов"
          />

          <Field.Text
            name="confirmNewPassword"
            label="Подтвердите новый пароль"
            type={showConfirmPassword.value ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showConfirmPassword.onToggle} edge="end">
                    <Iconify
                      icon={
                        showConfirmPassword.value
                          ? "solar:eye-bold"
                          : "solar:eye-closed-bold"
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
      </Card>
    </Form>
  );
}
