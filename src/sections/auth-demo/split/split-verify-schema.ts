import { z as zod } from "zod";

// ----------------------------------------------------------------------

export const VerifySchema = zod.object({
  code: zod
    .string()
    .min(1, { message: "Code is required!" })
    .length(6, { message: "Code must be exactly 6 digits!" })
    .regex(/^\d+$/, { message: "Code must contain only digits!" }),
  email: zod
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Email must be a valid email address!" }),
});
