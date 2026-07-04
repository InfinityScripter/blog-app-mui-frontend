import type { SystemStyleObject } from "@mui/system";
import type { StackProps } from "@mui/material/Stack";
import type { Theme, SxProps } from "@mui/material/styles";

// ----------------------------------------------------------------------

interface FileThumbnailSlotProps {
  img?: SystemStyleObject<Theme>;
  icon?: SystemStyleObject<Theme>;
  removeBtn?: SxProps<Theme>;
  downloadBtn?: SxProps<Theme>;
}

export interface FileThumbnailProps extends Omit<StackProps, "onClick"> {
  file: File | string;
  tooltip?: boolean;
  imageView?: boolean;
  onRemove?: () => void;
  onDownload?: () => void;
  slotProps?: FileThumbnailSlotProps;
}

// ----------------------------------------------------------------------

// Dropzone augments File with `path`/`preview`; some browsers expose the
// legacy non-standard `lastModifiedDate`. Model them here so reads are typed.
export interface FileWithMeta extends File {
  path?: string;
  preview?: string;
  lastModifiedDate?: Date;
}

export interface FileData {
  name: string | undefined;
  size: number | undefined;
  path: string | undefined;
  type: string | undefined;
  preview: string | undefined;
  lastModified: number | undefined;
  lastModifiedDate: Date | undefined;
}
