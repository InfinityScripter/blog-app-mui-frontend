import Box from "@mui/material/Box";

import { formatImageUrl } from "../../../utils/format-image-url";

import type { SingleFilePreviewProps } from "../types";

// ----------------------------------------------------------------------

export function SingleFilePreview({ file }: SingleFilePreviewProps) {
  const fileName = typeof file === "string" ? file : file.name;
  const previewUrl =
    typeof file === "string" ? formatImageUrl(file) : URL.createObjectURL(file);

  return (
    <Box
      sx={{
        p: 1,
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        position: "absolute",
      }}
    >
      <Box
        component="img"
        alt={fileName}
        src={previewUrl}
        sx={{
          width: 1,
          height: 1,
          borderRadius: 1,
          objectFit: "cover",
        }}
      />
    </Box>
  );
}
