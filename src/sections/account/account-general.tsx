"use client";

import Grid from "@mui/material/Grid";
import { useForm } from "react-hook-form";
import { useMemo, useEffect } from "react";
import { useAuthContext } from "src/auth/hooks";
import { toast } from "src/components/snackbar";
import { Form } from "src/components/hook-form";
import { useBoolean } from "src/hooks/use-boolean";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatImageUrl } from "src/utils/format-image-url";
import {
  uploadFile,
  updateAvatar,
  removeAvatar,
  updateProfile,
} from "src/actions/account";

import { AccountGeneralSchema } from "./account-general-schema";
import { AccountGeneralDetails } from "./account-general-details";
import { AccountGeneralIdentity } from "./account-general-identity";

// ----------------------------------------------------------------------

export { AccountGeneralSchema };

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
          <AccountGeneralIdentity
            name={user?.name}
            role={role}
            verified={verified}
            hasAvatar={hasAvatar}
            removingAvatar={removingAvatar.value}
            onRemoveAvatar={handleRemoveAvatar}
          />
        </Grid>

        {/* Details card — editable name + read-only contact info. */}
        <Grid size={{ xs: 12, md: 8 }}>
          <AccountGeneralDetails
            isChanged={isChanged}
            isSubmitting={isSubmitting}
          />
        </Grid>
      </Grid>
    </Form>
  );
}
