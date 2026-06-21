import Box from "@mui/material/Box";
import { varAlpha } from "src/theme/styles";
import { useDropzone } from "react-dropzone";
import FormHelperText from "@mui/material/FormHelperText";

import { DeleteButton } from "./components/delete-button";
import { UploadPlaceholder } from "./components/placeholder";
import { RejectionFiles } from "./components/rejection-files";
import { SingleFilePreview } from "./components/preview-single-file";
import { UploadMultiPreview } from "./components/upload-multi-preview";

import type { UploadProps } from "./types";

// ----------------------------------------------------------------------

export function Upload({
  sx,
  value,
  error,
  disabled,
  onDelete,
  onUpload,
  onRemove,
  thumbnail,
  helperText,
  onRemoveAll,
  multiple = false,
  ...other
}: UploadProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple,
    disabled,
    ...other,
  });

  const isArray = Array.isArray(value) && multiple;

  const singleFile = !Array.isArray(value) ? value : null;

  const hasFile = !isArray && !!singleFile;

  const hasFiles = isArray && !!value.length;

  const hasError = isDragReject || !!error;

  return (
    <Box sx={{ width: 1, position: "relative", ...sx }}>
      <Box
        {...getRootProps()}
        sx={{
          p: 5,
          outline: "none",
          borderRadius: 1,
          cursor: "pointer",
          overflow: "hidden",
          position: "relative",
          bgcolor: (theme) =>
            varAlpha(theme.vars.palette.grey["500Channel"], 0.08),
          border: (theme) =>
            `1px dashed ${varAlpha(theme.vars.palette.grey["500Channel"], 0.2)}`,
          transition: (theme) =>
            theme.transitions.create(["opacity", "padding"]),
          "&:hover": { opacity: 0.72 },
          ...(isDragActive && { opacity: 0.72 }),
          ...(disabled && { opacity: 0.48, pointerEvents: "none" }),
          ...(hasError && {
            color: "error.main",
            borderColor: "error.main",
            bgcolor: (theme) =>
              varAlpha(theme.vars.palette.error.mainChannel, 0.08),
          }),
          ...(hasFile && { padding: "28% 0" }),
        }}
      >
        <input {...getInputProps()} />

        {/* Single file */}
        {hasFile && singleFile ? (
          <SingleFilePreview file={singleFile} />
        ) : (
          <UploadPlaceholder />
        )}
      </Box>

      {/* Single file */}
      {hasFile && <DeleteButton onClick={onDelete} />}

      {helperText && (
        <FormHelperText error={!!error} sx={{ px: 2 }}>
          {helperText}
        </FormHelperText>
      )}

      <RejectionFiles files={fileRejections} />

      {/* Multi files */}
      <UploadMultiPreview
        hasFiles={hasFiles}
        value={value}
        thumbnail={thumbnail}
        onRemove={onRemove}
        onUpload={onUpload}
        onRemoveAll={onRemoveAll}
      />
    </Box>
  );
}
