import { useMemo } from "react";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "src/components/snackbar";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";
import { zodResolver } from "@hookform/resolvers/zod";
// Import the two pieces directly — NOT from the hook-form barrel — so the
// public bundle doesn't statically pull RHFEditor/RHFUpload/RHFPhoneInput.
import { Form } from "src/components/hook-form/form-provider";
import { subscribeToNewsletter } from "src/actions/newsletter";
import { RHFCheckbox } from "src/components/hook-form/rhf-checkbox";
import { RHFTextField } from "src/components/hook-form/rhf-text-field";

import { darkFieldSx } from "./utils";
import {
  createNewsletterSchema,
  type NewsletterFormValues,
} from "./newsletter-schema";

// ----------------------------------------------------------------------

type NewsletterFormTone = "light" | "dark";

interface NewsletterFormProps {
  // "dark" = sits on the dark home panel (white-alpha filled input);
  // "light" = default surface (the post-footer capture).
  tone?: NewsletterFormTone;
}

// Compact email-capture form: RHF + zod → subscribeToNewsletter → toast.
// Shared between the dark home CTA panel and the light post-footer capture.
export function NewsletterForm({ tone = "light" }: NewsletterFormProps) {
  const t = useTranslations("home");
  const consentDetailsId = "newsletter-personal-data-consent-details";

  const schema = useMemo(
    () =>
      createNewsletterSchema(
        t("newsletter.invalidEmail"),
        t("newsletter.consentRequired"),
      ),
    [t],
  );

  const methods = useForm<NewsletterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", personalDataConsent: false },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await subscribeToNewsletter(data.email, data.personalDataConsent);
      toast.success(t("newsletter.success"));
      reset();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("newsletter.error");
      toast.error(message);
    }
  });

  const isDark = tone === "dark";

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={1.5} sx={{ width: 1 }}>
        <Stack
          spacing={1.5}
          direction={{ xs: "column", sm: "row" }}
          alignItems="flex-start"
        >
          <RHFTextField
            name="email"
            type="email"
            placeholder={t("newsletter.placeholder")}
            variant={isDark ? "filled" : "outlined"}
            sx={{ flexGrow: 1, ...(isDark ? darkFieldSx : {}) }}
          />

          <Button
            type="submit"
            size="large"
            color="primary"
            variant="contained"
            loading={isSubmitting}
            sx={{ flexShrink: 0, px: 3, width: { xs: 1, sm: "auto" } }}
          >
            {t("newsletter.button")}
          </Button>
        </Stack>

        <RHFCheckbox
          name="personalDataConsent"
          label={t("newsletter.consentPrefix")}
          slotProps={{
            checkbox: {
              inputProps: { "aria-describedby": consentDetailsId },
            },
          }}
        />

        <Typography
          id={consentDetailsId}
          component="p"
          variant="caption"
          color={isDark ? "common.white" : "text.secondary"}
          sx={{ m: 0, mt: -1.25, pl: 5.25 }}
        >
          <Link
            component={RouterLink}
            href={paths.legal.personalDataConsent}
            target="_blank"
            rel="noopener noreferrer"
            underline="always"
            color="inherit"
          >
            {t("newsletter.consentLink")}
          </Link>
        </Typography>
      </Stack>
    </Form>
  );
}
