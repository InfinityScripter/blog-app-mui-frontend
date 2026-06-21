import type { BoxProps } from "@mui/material/Box";
import type { Theme, SxProps } from "@mui/material/styles";

// ----------------------------------------------------------------------

export interface ColorPickerProps extends Omit<BoxProps, "children"> {
  colors: string[];
  selected: string | string[];
  onSelectColor: (value: string | string[]) => void;
  limit?: number | "auto";
  sx?: SxProps<Theme>;
  slotProps?: {
    button?: SxProps<Theme>;
  };
}

export interface ColorPreviewProps extends Omit<BoxProps, "children"> {
  colors: string[];
  limit?: number;
  sx?: SxProps<Theme>;
}
