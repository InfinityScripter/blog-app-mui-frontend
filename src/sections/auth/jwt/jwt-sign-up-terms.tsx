import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import { Field } from "src/components/hook-form";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";

// ----------------------------------------------------------------------

export function JwtSignUpTerms() {
  const detailsId = "personal-data-consent-details";

  return (
    <Stack spacing={0.25} sx={{ mt: -1 }}>
      <Field.Checkbox
        name="personalDataConsent"
        label="Я согласен на обработку персональных данных"
        slotProps={{
          checkbox: { inputProps: { "aria-describedby": detailsId } },
        }}
      />

      <Typography
        id={detailsId}
        component="p"
        variant="caption"
        color="text.secondary"
        sx={{ m: 0, pl: 5.25 }}
      >
        {"Согласие даётся на условиях "}
        <Link
          component={RouterLink}
          href={paths.legal.personalDataConsent}
          target="_blank"
          rel="noopener noreferrer"
          underline="always"
          color="text.primary"
        >
          согласия на обработку персональных данных
        </Link>
        {". Также ознакомьтесь с "}
        <Link
          component={RouterLink}
          href={paths.legal.privacyPolicy}
          target="_blank"
          rel="noopener noreferrer"
          underline="always"
          color="text.primary"
        >
          политикой обработки персональных данных
        </Link>
        .
      </Typography>
    </Stack>
  );
}
