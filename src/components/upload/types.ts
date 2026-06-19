import type { ReactNode } from "react";
import type { Theme, SxProps } from "@mui/material/styles";
import type { FileRejection, DropzoneOptions } from "react-dropzone";

// ----------------------------------------------------------------------

export type FileUploadType = File | string | null;

export type FilesUploadType = (File | string)[];

export interface UploadProps extends DropzoneOptions {
  sx?: SxProps<Theme>;
  error?: boolean;
  disabled?: boolean;
  thumbnail?: boolean;
  helperText?: ReactNode;
  placeholder?: ReactNode;
  value?: FileUploadType | FilesUploadType;
  onDelete?: () => void;
  onUpload?: () => void;
  onRemove?: (file: File | string) => void;
  onRemoveAll?: () => void;
}

export interface UploadAvatarProps extends DropzoneOptions {
  sx?: SxProps<Theme>;
  error?: boolean;
  disabled?: boolean;
  helperText?: ReactNode;
  value?: FileUploadType;
}

export interface UploadBoxProps extends DropzoneOptions {
  sx?: SxProps<Theme>;
  error?: boolean;
  disabled?: boolean;
  placeholder?: ReactNode;
}

export interface MultiFilePreviewProps {
  sx?: SxProps<Theme>;
  thumbnail?: boolean;
  firstNode?: ReactNode;
  lastNode?: ReactNode;
  files?: FilesUploadType;
  onRemove?: (file: File | string) => void;
  slotProps?: {
    thumbnail?: Record<string, unknown>;
  };
}

export interface SingleFilePreviewProps {
  file: File | string;
}

export interface RejectionFilesProps {
  files: readonly FileRejection[];
}
