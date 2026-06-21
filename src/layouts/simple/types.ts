import type { ReactNode } from "react";
import type { Theme, SxProps } from "@mui/material/styles";

// ----------------------------------------------------------------------

export interface MainProps {
  children?: ReactNode;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

export interface CompactContentProps {
  children?: ReactNode;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}

export interface SimpleLayoutProps {
  sx?: SxProps<Theme>;
  children: ReactNode;
  content?: {
    compact?: boolean;
  };
}
