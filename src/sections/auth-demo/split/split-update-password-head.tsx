import Stack from "@mui/material/Stack";
import { SentIcon } from "src/assets/icons";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

export function SplitUpdatePasswordHead() {
  return (
    <>
      <SentIcon sx={{ mx: "auto" }} />

      <Stack
        spacing={1}
        sx={{ mt: 3, mb: 5, textAlign: "center", whiteSpace: "pre-line" }}
      >
        <Typography variant="h5">Request sent successfully!</Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {`We've sent a 6-digit confirmation email to your email. \nPlease enter the code in below box to verify your email.`}
        </Typography>
      </Stack>
    </>
  );
}
