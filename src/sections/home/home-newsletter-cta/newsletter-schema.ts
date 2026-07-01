import { z as zod } from "zod";

// ----------------------------------------------------------------------

export const NewsletterSchema = zod.object({
  email: zod.string().email("Введите корректный email"),
});

export type NewsletterFormValues = zod.infer<typeof NewsletterSchema>;
