import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import { Iconify } from "../../iconify";
import { MultiFilePreview } from "./preview-multi-file";

import type { UploadMultiPreviewProps } from "../types";

// ----------------------------------------------------------------------

export function UploadMultiPreview({
  hasFiles,
  value,
  thumbnail,
  onRemove,
  onUpload,
  onRemoveAll,
}: UploadMultiPreviewProps) {
  if (!hasFiles) {
    return null;
  }

  const files = Array.isArray(value) ? value : [];

  return (
    <>
      <MultiFilePreview
        files={files}
        thumbnail={thumbnail}
        onRemove={onRemove}
        sx={{ my: 3 }}
      />

      {(onRemoveAll || onUpload) && (
        <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
          {onRemoveAll && (
            <Button
              color="inherit"
              variant="outlined"
              size="small"
              onClick={onRemoveAll}
            >
              Remove all
            </Button>
          )}

          {onUpload && (
            <Button
              size="small"
              variant="contained"
              onClick={onUpload}
              startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            >
              Upload
            </Button>
          )}
        </Stack>
      )}
    </>
  );
}
