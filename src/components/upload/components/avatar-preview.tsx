import { Image } from "../../image";

import type { AvatarPreviewProps } from "../types";

// ----------------------------------------------------------------------

export function AvatarPreview({ hasFile, preview }: AvatarPreviewProps) {
  if (!hasFile) {
    return null;
  }

  return (
    <Image
      alt="avatar"
      src={preview}
      sx={{ width: 1, height: 1, borderRadius: "50%" }}
    />
  );
}
