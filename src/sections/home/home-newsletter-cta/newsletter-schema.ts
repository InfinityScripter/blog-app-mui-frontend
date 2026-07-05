import { z as zod } from "zod";

// ----------------------------------------------------------------------

// Schema is a factory so the validation message can be localised: the caller
// (NewsletterForm) passes the resolved `home.newsletter.invalidEmail` string
// from `useTranslations` — a module-scope schema can't call the `t()` hook.
export function createNewsletterSchema(invalidEmailMessage: string) {
  return zod.object({
    email: zod.string().email(invalidEmailMessage),
  });
}

export type NewsletterFormValues = zod.infer<
  ReturnType<typeof createNewsletterSchema>
>;
