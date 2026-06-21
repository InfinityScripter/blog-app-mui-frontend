import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { Label } from "src/components/label";
import { fData } from "src/utils/format-number";
import { Iconify } from "src/components/iconify";
import { Field } from "src/components/hook-form";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import { ROLE_LABEL } from "./account-general-const";

import type { AccountGeneralIdentityProps } from "./types";

// ----------------------------------------------------------------------

export function AccountGeneralIdentity({
  name,
  role,
  verified,
  hasAvatar,
  removingAvatar,
  onRemoveAvatar,
}: AccountGeneralIdentityProps) {
  return (
    <Card
      sx={{
        p: 3,
        pt: 5,
        height: 1,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Label
        color={role === "admin" ? "info" : "default"}
        startIcon={<Iconify icon="solar:shield-user-bold" />}
        sx={{ position: "absolute", top: 24, left: 24 }}
      >
        {ROLE_LABEL[role] ?? role}
      </Label>

      <Field.UploadAvatar
        name="avatarURL"
        maxSize={3145728}
        helperText={
          <Typography
            variant="caption"
            sx={{
              mt: 3,
              mx: "auto",
              display: "block",
              textAlign: "center",
              color: "text.disabled",
            }}
          >
            *.jpeg, *.jpg, *.png, *.gif
            <br /> до {fData(3145728)}
          </Typography>
        }
      />

      {hasAvatar && (
        <LoadingButton
          variant="soft"
          color="error"
          size="small"
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          onClick={onRemoveAvatar}
          loading={removingAvatar}
          sx={{ mt: 3 }}
        >
          Удалить фото
        </LoadingButton>
      )}

      <Divider sx={{ my: 3, width: 1, borderStyle: "dashed" }} />

      <Stack spacing={1} sx={{ width: 1 }}>
        <Typography variant="subtitle1" noWrap>
          {name}
        </Typography>

        <Stack
          direction="row"
          spacing={0.75}
          alignItems="center"
          justifyContent="center"
          sx={{ color: verified ? "success.main" : "warning.main" }}
        >
          <Iconify
            width={18}
            icon={
              verified
                ? "solar:verified-check-bold"
                : "solar:danger-triangle-bold"
            }
          />
          <Typography variant="caption">
            {verified ? "Email подтверждён" : "Email не подтверждён"}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
