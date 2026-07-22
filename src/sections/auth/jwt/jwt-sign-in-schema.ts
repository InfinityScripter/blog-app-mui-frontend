import { z as zod } from "zod";

// ----------------------------------------------------------------------

export const SignInSchema = zod.object({
  email: zod.string().min(1, { message: "Email обязателен!" }).email({
    message: "Email должен быть действительным адресом электронной почты!",
  }),
  password: zod.string().min(1, { message: "Пароль обязателен!" }),
  personalDataConsent: zod.boolean().optional(),
});
