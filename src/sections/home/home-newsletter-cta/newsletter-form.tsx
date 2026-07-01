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

import { NL_BUTTON, NL_SUCCESS, NL_PLACEHOLDER } from "./const";
import { NewsletterSchema, type NewsletterFormValues } from "./newsletter-schema";

// ----------------------------------------------------------------------

// Compact email-capture form: RHF + zod → subscribeToNewsletter → toast.
// Shared between the home CTA section and the post footer capture.
export function NewsletterForm() {
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

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack
        spacing={1.5}
        direction={{ xs: "column", sm: "row" }}
        alignItems="flex-start"
        justifyContent="center"
        sx={{ width: 1, maxWidth: 480, mx: "auto" }}
      >
        <RHFTextField
          name="email"
          type="email"
          placeholder={NL_PLACEHOLDER}
          sx={{ flexGrow: 1 }}
        />

        <LoadingButton
          type="submit"
          size="large"
          variant="contained"
          loading={isSubmitting}
        >
          {NL_BUTTON}
        </LoadingButton>
      </Stack>
    </Form>
  );
}
