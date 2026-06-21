import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { SocialIcon } from "src/components/iconify";

// ----------------------------------------------------------------------

export function CenteredSignInSocials() {
  return (
    <>
      <Divider
        sx={{
          my: 3,
          typography: "overline",
          color: "text.disabled",
          "&::before, :after": { borderTopStyle: "dashed" },
        }}
      >
        OR
      </Divider>

      <Stack direction="row" justifyContent="center" spacing={1}>
        <IconButton>
          <SocialIcon icon="google" width={22} />
        </IconButton>

        <IconButton>
          <SocialIcon icon="github" width={22} />
        </IconButton>

        <IconButton>
          <SocialIcon icon="twitter" width={22} />
        </IconButton>
      </Stack>
    </>
  );
}
