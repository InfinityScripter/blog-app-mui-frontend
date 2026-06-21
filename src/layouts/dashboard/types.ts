import type { ReactNode } from "react";
import type { ContainerProps } from "@mui/material/Container";
import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";
import type { NavSectionDataProps } from "src/components/nav-section/types";

// ----------------------------------------------------------------------

export interface DashboardLayoutProps {
  sx?: SxProps<Theme>;
  children: ReactNode;
  data?: {
    nav?: NavSectionDataProps[];
  };
}

export interface MainProps {
  children: ReactNode;
  isNavHorizontal?: boolean;
  sx?: SxProps<Theme>;
}

export interface DashboardContentProps
  extends Omit<ContainerProps, "maxWidth"> {
  sx?: SxProps<Theme>;
  children: ReactNode;
  disablePadding?: boolean;
  maxWidth?: ContainerProps["maxWidth"];
}

export interface NavHorizontalProps {
  data: NavSectionDataProps[];
  layoutQuery: Breakpoint;
  sx?: SxProps<Theme>;
  cssVars?: Record<string, string | number>;
  [key: string]: unknown;
}

export interface NavMobileProps {
  data: NavSectionDataProps[];
  open: boolean;
  onClose: () => void;
  slots?: {
    topArea?: ReactNode;
    bottomArea?: ReactNode;
  };
  sx?: SxProps<Theme>;
  cssVars?: Record<string, string | number>;
  [key: string]: unknown;
}

export interface DashboardNavSlots {
  topArea?: ReactNode;
  bottomArea?: ReactNode;
}

export interface NavVerticalProps {
  sx?: SxProps<Theme>;
  data: NavSectionDataProps[];
  slots?: DashboardNavSlots;
  isNavMini?: boolean;
  layoutQuery: Breakpoint;
  onToggleNav?: () => void;
  cssVars?: Record<string, string | number>;
  [key: string]: unknown;
}

export interface NavVerticalBodyProps {
  data: NavSectionDataProps[];
  slots?: DashboardNavSlots;
  [key: string]: unknown;
}

export interface NavVerticalMiniProps {
  data: NavSectionDataProps[];
  slots?: DashboardNavSlots;
  [key: string]: unknown;
}
