import Stack from "@mui/material/Stack";
import { EmailInboxIcon } from "src/assets/icons";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

export function CenteredVerifyHead() {
  return (
    <>
      <EmailInboxIcon sx={{ mx: "auto" }} />

      <Stack
        spacing={1}
        sx={{ mt: 3, mb: 5, textAlign: "center", whiteSpace: "pre-line" }}
      >
        <Typography variant="h5">Please check your email!</Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {`We've emailed a 6-digit confirmation code. \nPlease enter the code in the box below to verify your email.`}
        </Typography>
      </Stack>
    </>
  );
}
