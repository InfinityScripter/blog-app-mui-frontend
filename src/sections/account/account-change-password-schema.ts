import { z as zod } from "zod";

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
