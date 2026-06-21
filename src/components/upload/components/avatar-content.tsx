import Box from "@mui/material/Box";

import { AvatarPreview } from "./avatar-preview";
import { AvatarPlaceholder } from "./avatar-placeholder";

import type { AvatarContentProps } from "../types";

// ----------------------------------------------------------------------

export function AvatarContent({
  hasFile,
  hasError,
  preview,
}: AvatarContentProps) {
  return (
    <Box
      sx={{
        width: 1,
        height: 1,
        overflow: "hidden",
        borderRadius: "50%",
        position: "relative",
      }}
    >
      <AvatarPreview hasFile={hasFile} preview={preview} />
      <AvatarPlaceholder hasFile={hasFile} hasError={hasError} />
    </Box>
  );
}
