import type { ReactNode } from "react";
import type { Theme, SxProps } from "@mui/material/styles";
import type { BreadcrumbsProps } from "@mui/material/Breadcrumbs";

// ----------------------------------------------------------------------

interface BreadcrumbLinkItem {
  name?: ReactNode;
  href?: string;
  icon?: ReactNode;
}

export interface BreadcrumbsLinkProps {
  link: BreadcrumbLinkItem;
  activeLast?: boolean;
  disabled?: boolean;
}

export interface CustomBreadcrumbsProps
  extends Omit<BreadcrumbsProps, "children" | "slotProps"> {
  links: BreadcrumbLinkItem[];
  action?: ReactNode;
  heading?: ReactNode;
  moreLink?: string[];
  activeLast?: boolean;
  slotProps?: {
    heading?: SxProps<Theme>;
    breadcrumbs?: SxProps<Theme>;
    action?: SxProps<Theme>;
    moreLink?: SxProps<Theme>;
  };
  sx?: SxProps<Theme>;
}
