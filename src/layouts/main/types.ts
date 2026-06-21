import type { ReactNode } from "react";
import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";

import type { MainNavItem } from "./nav/types";

// ----------------------------------------------------------------------

export interface FooterProps {
  layoutQuery: Breakpoint;
  sx?: SxProps<Theme>;
}

export interface HomeFooterProps {
  sx?: SxProps<Theme>;
}

export interface MainLayoutProps {
  sx?: SxProps<Theme>;
  data?: {
    nav?: MainNavItem[];
  };
  children: ReactNode;
}

export interface MainProps {
  children?: ReactNode;
  sx?: SxProps<Theme>;
  [key: string]: unknown;
}
