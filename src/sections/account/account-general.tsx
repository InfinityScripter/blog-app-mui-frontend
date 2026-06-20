"use client";

import { z as zod } from "zod";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useForm } from "react-hook-form";
import { useMemo, useEffect } from "react";
import { fData } from "src/utils/format-number";
import { useAuthContext } from "src/auth/hooks";
import { toast } from "src/components/snackbar";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Field, schemaHelper } from "src/components/hook-form";
import { uploadFile, updateAvatar, updateProfile } from "src/actions/account";

// ----------------------------------------------------------------------

export const AccountGeneralSchema = zod.object({
  name: zod.string().min(1, { message: "Имя обязательно!" }),
  avatarURL: schemaHelper.file().nullable(),
  email: zod.string(),
  role: zod.string(),
});

// ----------------------------------------------------------------------

export function AccountGeneral() {
  const { user, checkUserSession } = useAuthContext();

  const defaultValues = useMemo(
    () => ({
      name: user?.name ?? "",
      avatarURL: user?.avatarURL ?? null,
      email: user?.email ?? "",
      role: user?.role ?? "user",
    }),
    [user],
  );

  const methods = useForm({
    mode: "all",
    resolver: zodResolver(AccountGeneralSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

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
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: "center" }}>
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
                  Допустимы *.jpeg, *.jpg, *.png, *.gif
                  <br /> макс. размер {fData(3145728)}
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
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
              <Field.Text name="name" label="Имя" />

              <Field.Text name="email" label="Email адрес" disabled />

              <Field.Text name="role" label="Роль" disabled />
            </Box>

            <Stack spacing={3} sx={{ mt: 3, alignItems: "flex-end" }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
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
