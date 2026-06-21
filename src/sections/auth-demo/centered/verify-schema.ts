import { z as zod } from "zod";

// ----------------------------------------------------------------------

export const VerifySchema = zod.object({
  code: zod
    .string()
    .min(1, { message: "Code is required!" })
    .min(6, { message: "Code must be at least 6 characters!" }),
  email: zod
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Email must be a valid email address!" }),
});
