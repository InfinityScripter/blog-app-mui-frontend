import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { Iconify } from "src/components/iconify";
import { Field } from "src/components/hook-form";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

// ----------------------------------------------------------------------

type Props = {
  isChanged: boolean;
  isSubmitting: boolean;
};

export function AccountGeneralDetails({ isChanged, isSubmitting }: Props) {
  return (
    <Card sx={{ p: 3, height: 1 }}>
      <Typography variant="h6" sx={{ mb: 0.5 }}>
        Основная информация
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Эти данные видны в вашем профиле и комментариях.
      </Typography>

      <Box
        sx={{
          rowGap: 3,
          columnGap: 2,
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
          },
        }}
      >
        <Field.Text
          name="name"
          label="Имя"
          sx={{ gridColumn: { sm: "1 / -1" } }}
        />

        <Field.Text
          name="email"
          label="Email адрес"
          disabled
          helperText="Email изменить нельзя"
        />

        <Field.Text name="role" label="Роль" disabled />
      </Box>

      <Divider sx={{ my: 3, borderStyle: "dashed" }} />

      <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end" }}>
        <LoadingButton
          type="submit"
          variant="contained"
          disabled={!isChanged}
          loading={isSubmitting}
          startIcon={<Iconify icon="solar:diskette-bold" />}
        >
          Сохранить изменения
        </LoadingButton>
      </Stack>
    </Card>
  );
}
