import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { varAlpha } from "src/theme/styles";
import { useDropzone } from "react-dropzone";

import { AvatarContent } from "./components/avatar-content";
import { RejectionFiles } from "./components/rejection-files";

import type { UploadAvatarProps } from "./types";

// ----------------------------------------------------------------------

export function UploadAvatar({
  sx,
  error,
  value,
  disabled,
  helperText,
  ...other
}: UploadAvatarProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple: false,
    disabled,
    accept: { "image/*": [] },
    ...other,
  });

  const hasFile = !!value;

  const hasError = isDragReject || !!error;

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (typeof value === "string") {
      setPreview(value);
    } else if (value instanceof File) {
      setPreview(URL.createObjectURL(value));
    }
  }, [value]);

  return (
    <>
      <Box
        {...getRootProps()}
        sx={{
          p: 1,
          m: "auto",
          width: 144,
          height: 144,
          cursor: "pointer",
          overflow: "hidden",
          borderRadius: "50%",
          border: (theme) =>
            `1px dashed ${varAlpha(theme.vars.palette.grey["500Channel"], 0.2)}`,
          ...(isDragActive && { opacity: 0.72 }),
          ...(disabled && { opacity: 0.48, pointerEvents: "none" }),
          ...(hasError && { borderColor: "error.main" }),
          ...(hasFile && {
            ...(hasError && {
              bgcolor: (theme) =>
                varAlpha(theme.vars.palette.error.mainChannel, 0.08),
            }),
            "&:hover .upload-placeholder": { opacity: 1 },
          }),
          ...sx,
        }}
      >
        <input {...getInputProps()} />

        <AvatarContent
          hasFile={hasFile}
          hasError={hasError}
          preview={preview}
        />
      </Box>

      {helperText && helperText}

      <RejectionFiles files={fileRejections} />
    </>
  );
}
