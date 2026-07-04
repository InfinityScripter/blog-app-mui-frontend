import type { ChangePasswordSchemaType } from "./types";

// ----------------------------------------------------------------------

// Начальные значения формы смены пароля.
export const CHANGE_PASSWORD_DEFAULT_VALUES: ChangePasswordSchemaType = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

// Подписи ролей пользователя для блока «Личные данные».
export const ROLE_LABEL: Record<string, string> = {
  admin: "Администратор",
  user: "Пользователь",
};
