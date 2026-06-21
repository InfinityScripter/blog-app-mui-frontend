import Stack from "@mui/material/Stack";
import { PasswordIcon } from "src/assets/icons";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

export function CenteredResetPasswordHead() {
  return (
    <>
      <PasswordIcon sx={{ mx: "auto" }} />

      <Stack
        spacing={1}
        sx={{ mt: 3, mb: 5, textAlign: "center", whiteSpace: "pre-line" }}
      >
        <Typography variant="h5">Забыли пароль?</Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Пожалуйста, введите email-адрес, связанный с вашей учетной записью, и
          мы отправим вам ссылку для сброса пароля.
        </Typography>
      </Stack>
    </>
  );
}
