import { z as zod } from "zod";

// ----------------------------------------------------------------------

export const SignUpSchema = zod.object({
  firstName: zod.string().min(1, { message: "Имя обязательно!" }),
  lastName: zod.string().min(1, { message: "Фамилия обязательна!" }),
  email: zod.string().min(1, { message: "Email обязателен!" }).email({
    message: "Email должен быть действительным адресом электронной почты!",
  }),
  password: zod
    .string()
    .min(1, { message: "Пароль обязателен!" })
    .min(8, { message: "Пароль должен содержать не менее 8 символов!" }),
  personalDataConsent: zod.boolean().refine(Boolean, {
    message: "Подтвердите согласие на обработку персональных данных",
  }),
});
