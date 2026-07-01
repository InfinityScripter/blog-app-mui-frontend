import Stack from "@mui/material/Stack";
import { useForm } from "react-hook-form";
import { toast } from "src/components/snackbar";
import LoadingButton from "@mui/lab/LoadingButton";
import { zodResolver } from "@hookform/resolvers/zod";
// Import the two pieces directly — NOT from the hook-form barrel — so the
// public bundle doesn't statically pull RHFEditor/RHFUpload/RHFPhoneInput.
import { Form } from "src/components/hook-form/form-provider";
import { subscribeToNewsletter } from "src/actions/newsletter";
import { RHFTextField } from "src/components/hook-form/rhf-text-field";

import { darkFieldSx } from "./utils";
import { NL_BUTTON, NL_SUCCESS, NL_PLACEHOLDER } from "./const";
import { NewsletterSchema, type NewsletterFormValues } from "./newsletter-schema";

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
  const methods = useForm<NewsletterFormValues>({
    resolver: zodResolver(NewsletterSchema),
    defaultValues: { email: "" },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await subscribeToNewsletter(data.email);
      toast.success(NL_SUCCESS);
      reset();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось подписаться";
      toast.error(message);
    }
  });

  const isDark = tone === "dark";

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack
        spacing={1.5}
        direction={{ xs: "column", sm: "row" }}
        alignItems="flex-start"
        sx={{ width: 1 }}
      >
        <RHFTextField
          name="email"
          type="email"
          placeholder={NL_PLACEHOLDER}
          variant={isDark ? "filled" : "outlined"}
          sx={{ flexGrow: 1, ...(isDark ? darkFieldSx : {}) }}
        />

        <LoadingButton
          type="submit"
          size="large"
          color="primary"
          variant="contained"
          loading={isSubmitting}
          sx={{ flexShrink: 0, px: 3, width: { xs: 1, sm: "auto" } }}
        >
          {NL_BUTTON}
        </LoadingButton>
      </Stack>
    </Form>
  );
}
