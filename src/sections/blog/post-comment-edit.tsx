"use client";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useTranslations } from "next-intl";
import TextField from "@mui/material/TextField";
import { Iconify } from "src/components/iconify";

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
  const t = useTranslations("blog");

  return (
    <Stack spacing={2}>
      <TextField
        fullWidth
        multiline
        size="small"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder={t("comments.editPlaceholder")}
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
          {t("comments.cancel")}
        </Button>
        <Button
          size="small"
          onClick={onSave}
          loading={saving}
          startIcon={<Iconify icon="eva:checkmark-fill" />}
          color="success"
        >
          {t("comments.save")}
        </Button>
      </Stack>
    </Stack>
  );
}
