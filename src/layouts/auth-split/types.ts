import type { ReactNode } from "react";
import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";

// ----------------------------------------------------------------------

export type AuthMethod = "jwt" | "amplify" | "firebase" | "supabase" | "auth0";

export interface AuthSplitMethodOption {
  label: string;
  path: string;
  icon: string;
}

export interface AuthSplitMainProps {
  sx?: SxProps<Theme>;
  children: ReactNode;
  layoutQuery: Breakpoint;
}

export interface AuthSplitContentProps {
  sx?: SxProps<Theme>;
  children: ReactNode;
  layoutQuery: Breakpoint;
}

export interface AuthSplitSectionProps {
  sx?: SxProps<Theme>;
  method?: AuthMethod;
  layoutQuery: Breakpoint;
  methods?: AuthSplitMethodOption[];
  title?: string;
  subtitle?: string;
}

export interface AuthSplitLayoutProps {
  sx?: SxProps<Theme>;
  section?: {
    title?: string;
    subtitle?: string;
  };
  children: ReactNode;
}
