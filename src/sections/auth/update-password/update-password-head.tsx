import Stack from "@mui/material/Stack";
import { SentIcon } from "src/assets/icons";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

export function UpdatePasswordHead() {
  return (
    <>
      <SentIcon sx={{ mx: "auto" }} />

      <Stack
        spacing={1}
        sx={{ mt: 3, mb: 5, textAlign: "center", whiteSpace: "pre-line" }}
      >
        <Typography variant="h5">Update Your Password</Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Please enter your verification code and new password
        </Typography>
      </Stack>
    </>
  );
}
