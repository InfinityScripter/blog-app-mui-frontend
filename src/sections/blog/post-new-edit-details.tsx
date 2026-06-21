import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { Field } from "src/components/hook-form";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

import type { PostNewEditDetailsProps } from "./types";

// ----------------------------------------------------------------------

export function PostNewEditDetails({ onRemoveFile }: PostNewEditDetailsProps) {
  return (
    <Card>
      <CardHeader
        title="Детали"
        subheader="Заголовок, краткое описание, изображение..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="title" label="Заголовок поста" />

        <Field.Text name="description" label="Описание" multiline rows={3} />

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Содержание</Typography>
          <Field.Editor name="content" sx={{ maxHeight: 480 }} />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Обложка</Typography>
          <Field.Upload
            name="coverUrl"
            maxSize={3145728}
            onDelete={onRemoveFile}
          />
        </Stack>
      </Stack>
    </Card>
  );
}
