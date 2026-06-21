import { z as zod } from "zod";

// ----------------------------------------------------------------------

export const ResetPasswordSchema = zod.object({
  email: zod.string().min(1, { message: "Email обязателен!" }).email({
    message: "Email должен быть действительным адресом электронной почты!",
  }),
});
