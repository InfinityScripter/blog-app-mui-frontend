import type { ChangePasswordSchemaType } from "./types";

// ----------------------------------------------------------------------

export const defaultValues: ChangePasswordSchemaType = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};
