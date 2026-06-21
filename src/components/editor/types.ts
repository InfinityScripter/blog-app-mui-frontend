import type { Editor } from "@tiptap/react";
import type { Theme, SxProps } from "@mui/material/styles";

// ----------------------------------------------------------------------

export interface EditorProps {
  sx?: SxProps<Theme>;
  error?: boolean;
  onChange?: (value: string) => void;
  slotProps?: {
    wrap?: SxProps<Theme>;
  };
  helperText?: string;
  resetValue?: boolean;
  editable?: boolean;
  fullItem?: boolean;
  value?: string;
  placeholder?: string;
}

export interface ToolbarProps {
  editor: Editor | null;
  fullItem?: boolean;
  fullScreen: boolean;
  onToggleFullScreen: () => void;
}

export interface StyledRootProps {
  error?: boolean;
  disabled?: boolean;
  fullScreen?: boolean;
}
