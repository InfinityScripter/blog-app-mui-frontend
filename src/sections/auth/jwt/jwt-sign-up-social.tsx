import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { Iconify, SocialIcon } from "src/components/iconify";
import { signInWithGoogle, signInWithYandex } from "src/auth/context/jwt";

// ----------------------------------------------------------------------

export function JwtSignUpSocial() {
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
        ИЛИ
      </Divider>

      <Stack spacing={1.5}>
        <Button
          fullWidth
          size="large"
          variant="outlined"
          startIcon={<Iconify icon="flat-color-icons:google" />}
          onClick={signInWithGoogle}
        >
          Продолжить через Google
        </Button>

        <Button
          fullWidth
          size="large"
          variant="outlined"
          startIcon={<SocialIcon icon="yandex" />}
          onClick={signInWithYandex}
        >
          Продолжить через Yandex ID
        </Button>
      </Stack>
    </>
  );
}
