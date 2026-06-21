import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";

import { authDemoPaths } from "../paths";

// ----------------------------------------------------------------------

export function CenteredSignInHead() {
  return (
    <Stack alignItems="center" spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">Sign in to your account</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {`Don't have an account?`}
        </Typography>

        <Link
          component={RouterLink}
          href={authDemoPaths.centered.signUp}
          variant="subtitle2"
        >
          Get started
        </Link>
      </Stack>
    </Stack>
  );
}
