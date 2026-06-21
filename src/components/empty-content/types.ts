import type { ReactNode } from "react";
import type { StackProps } from "@mui/material/Stack";
import type { Theme, SxProps } from "@mui/material/styles";

// ----------------------------------------------------------------------

export interface EmptyContentProps extends StackProps {
  sx?: SxProps<Theme>;
  imgUrl?: string;
  action?: ReactNode;
  filled?: boolean;
  slotProps?: {
    img?: SxProps<Theme>;
    title?: SxProps<Theme>;
    description?: SxProps<Theme>;
  };
  description?: string;
  title?: string;
}
