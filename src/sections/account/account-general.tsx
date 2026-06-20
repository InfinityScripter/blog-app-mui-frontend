"use client";

import { z as zod } from "zod";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useForm } from "react-hook-form";
import { useMemo, useEffect } from "react";
import Divider from "@mui/material/Divider";
import { Label } from "src/components/label";
import { fData } from "src/utils/format-number";
import { useAuthContext } from "src/auth/hooks";
import { toast } from "src/components/snackbar";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { useBoolean } from "src/hooks/use-boolean";
import LoadingButton from "@mui/lab/LoadingButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatImageUrl } from "src/utils/format-image-url";
import { Form, Field, schemaHelper } from "src/components/hook-form";
import {
  uploadFile,
  updateAvatar,
  removeAvatar,
  updateProfile,
} from "src/actions/account";

// ----------------------------------------------------------------------

export const AccountGeneralSchema = zod.object({
  name: zod.string().min(1, { message: "Имя обязательно!" }),
  avatarURL: schemaHelper.file().nullable(),
  email: zod.string(),
  role: zod.string(),
});

const ROLE_LABEL: Record<string, string> = {
  admin: "Администратор",
  user: "Пользователь",
};

// ----------------------------------------------------------------------

export function AccountGeneral() {
  const { user, checkUserSession } = useAuthContext();

  const defaultValues = useMemo(
    () => ({
      name: user?.name ?? "",
      // Resolve the relative backend path so the avatar preview renders.
      avatarURL: user?.avatarURL ? formatImageUrl(user.avatarURL) : null,
      email: user?.email ?? "",
      role: user?.role ?? "user",
    }),
    [user],
  );

  const removingAvatar = useBoolean();

  const methods = useForm({
    mode: "all",
    resolver: zodResolver(AccountGeneralSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const currentAvatar = watch("avatarURL");
  const currentName = watch("name");
  const hasAvatar = Boolean(currentAvatar);

  // RHFUploadAvatar's onDrop doesn't flag the form dirty, so derive the
  // "changed" state ourselves: a freshly picked avatar is a File, or the name
  // differs from the saved value.
  const isChanged =
    currentAvatar instanceof File || currentName !== (user?.name ?? "");

  const role = user?.role ?? "user";
  const verified = user?.isEmailVerified ?? false;

  const handleRemoveAvatar = async () => {
    removingAvatar.onTrue();
    try {
      await removeAvatar();
      setValue("avatarURL", null, { shouldDirty: true });
      await checkUserSession?.();
      toast.success("Фото удалено");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Не удалось удалить фото",
      );
    } finally {
      removingAvatar.onFalse();
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Avatar: upload the new file first (if any), then persist the URL.
      if (data.avatarURL instanceof File) {
        const avatarURL = await uploadFile(data.avatarURL);
        await updateAvatar(avatarURL);
      }

      await updateProfile(data.name);

      // Refresh the auth context so the header/drawer avatar + name update live.
      await checkUserSession?.();

      toast.success("Профиль обновлён!");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Не удалось обновить профиль",
      );
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* Identity card — avatar, role, account status. */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              p: 3,
              pt: 5,
              height: 1,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Label
              color={role === "admin" ? "info" : "default"}
              startIcon={<Iconify icon="solar:shield-user-bold" />}
              sx={{ position: "absolute", top: 24, left: 24 }}
            >
              {ROLE_LABEL[role] ?? role}
            </Label>

            <Field.UploadAvatar
              name="avatarURL"
              maxSize={3145728}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: "auto",
                    display: "block",
                    textAlign: "center",
                    color: "text.disabled",
                  }}
                >
                  *.jpeg, *.jpg, *.png, *.gif
                  <br /> до {fData(3145728)}
                </Typography>
              }
            />

            {hasAvatar && (
              <LoadingButton
                variant="soft"
                color="error"
                size="small"
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                onClick={handleRemoveAvatar}
                loading={removingAvatar.value}
                sx={{ mt: 3 }}
              >
                Удалить фото
              </LoadingButton>
            )}

            <Divider sx={{ my: 3, width: 1, borderStyle: "dashed" }} />

            <Stack spacing={1} sx={{ width: 1 }}>
              <Typography variant="subtitle1" noWrap>
                {user?.name}
              </Typography>

              <Stack
                direction="row"
                spacing={0.75}
                alignItems="center"
                justifyContent="center"
                sx={{ color: verified ? "success.main" : "warning.main" }}
              >
                <Iconify
                  width={18}
                  icon={
                    verified
                      ? "solar:verified-check-bold"
                      : "solar:danger-triangle-bold"
                  }
                />
                <Typography variant="caption">
                  {verified ? "Email подтверждён" : "Email не подтверждён"}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        {/* Details card — editable name + read-only contact info. */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3, height: 1 }}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Основная информация
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
              Эти данные видны в вашем профиле и комментариях.
            </Typography>

            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                },
              }}
            >
              <Field.Text
                name="name"
                label="Имя"
                sx={{ gridColumn: { sm: "1 / -1" } }}
              />

              <Field.Text
                name="email"
                label="Email адрес"
                disabled
                helperText="Email изменить нельзя"
              />

              <Field.Text name="role" label="Роль" disabled />
            </Box>

            <Divider sx={{ my: 3, borderStyle: "dashed" }} />

            <Stack
              direction="row"
              spacing={1.5}
              sx={{ justifyContent: "flex-end" }}
            >
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={!isChanged}
                loading={isSubmitting}
                startIcon={<Iconify icon="solar:diskette-bold" />}
              >
                Сохранить изменения
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
