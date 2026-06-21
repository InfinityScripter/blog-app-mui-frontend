import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";

import { authDemoPaths } from "../paths";

// ----------------------------------------------------------------------

export function CenteredSignUpHead() {
  return (
    <Stack alignItems="center" spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">Get started absolutely free</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Already have an account?
        </Typography>

        <Link
          component={RouterLink}
          href={authDemoPaths.centered.signIn}
          variant="subtitle2"
        >
          Sign in
        </Link>
      </Stack>
    </Stack>
  );
}
