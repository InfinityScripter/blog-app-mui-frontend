import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Iconify } from "src/components/iconify";
import LoadingButton from "@mui/lab/LoadingButton";

import type { PostCommentEditProps } from "./types";

// ----------------------------------------------------------------------

export function PostCommentEdit({
  value,
  saving,
  onChange,
  onKeyPress,
  onSave,
  onCancel,
}: PostCommentEditProps) {
  return (
    <Stack spacing={2}>
      <TextField
        fullWidth
        multiline
        size="small"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder="Нажмите Enter для сохранения или Shift+Enter для новой строки"
        sx={{ mb: 1 }}
      />
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          size="small"
          color="inherit"
          onClick={onCancel}
          disabled={saving}
          startIcon={<Iconify icon="eva:close-fill" />}
        >
          Отмена
        </Button>
        <LoadingButton
          size="small"
          onClick={onSave}
          loading={saving}
          startIcon={<Iconify icon="eva:checkmark-fill" />}
          color="success"
        >
          Сохранить
        </LoadingButton>
      </Stack>
    </Stack>
  );
}
