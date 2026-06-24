import type { Theme, SxProps } from "@mui/material/styles";
import type { ButtonBaseProps } from "@mui/material/ButtonBase";
import type { ReactNode, ElementType, CSSProperties } from "react";

// ----------------------------------------------------------------------

export type NavItemRenderProps = {
  navIcon?: Record<string, ReactNode>;
  navInfo?: (val: string) => Record<string, ReactNode>;
};

export type NavItemStateProps = {
  depth?: number;
  open?: boolean;
  active?: boolean;
  disabled?: boolean;
  hasChild?: boolean;
  externalLink?: boolean;
  enabledRootRedirect?: boolean;
};

export type NavItemSlotProps = {
  sx?: SxProps<Theme>;
  icon?: SxProps<Theme>;
  texts?: SxProps<Theme>;
  title?: SxProps<Theme>;
  caption?: SxProps<Theme>;
  info?: SxProps<Theme>;
  arrow?: SxProps<Theme>;
};

export type NavSlotProps = {
  rootItem?: NavItemSlotProps;
  subItem?: NavItemSlotProps;
  subheader?: SxProps<Theme>;
  paper?: SxProps<Theme>;
  currentRole?: string;
};

export type NavItemBaseProps = {
  title?: string;
  path: string;
  icon?: ReactNode;
  info?: ReactNode;
  caption?: string;
  disabled?: boolean;
  roles?: string[];
  children?: NavItemBaseProps[];
};

export type NavItemProps = Omit<
  ButtonBaseProps,
  "title" | "disabled" | "slotProps"
> &
  NavItemStateProps &
  Omit<NavItemBaseProps, "children" | "roles"> & {
    render?: NavItemRenderProps;
    slotProps?: NavItemSlotProps;
  };

export type NavListProps = {
  data: NavItemBaseProps;
  depth: number;
  render?: NavItemRenderProps;
  cssVars?: CSSObject;
  slotProps?: NavSlotProps;
  enabledRootRedirect?: boolean;
};

export type NavGroupProps = {
  subheader?: string;
  items: NavItemBaseProps[];
  render?: NavItemRenderProps;
  cssVars?: CSSObject;
  slotProps?: NavSlotProps;
  enabledRootRedirect?: boolean;
};

export type NavSectionDataProps = {
  subheader?: string;
  items: NavItemBaseProps[];
};

export type NavSectionProps = {
  sx?: SxProps<Theme>;
  data: NavSectionDataProps[];
  render?: NavItemRenderProps;
  cssVars?: CSSObject;
  slotProps?: NavSlotProps;
  enabledRootRedirect?: boolean;
};

type CSSObject = {
  [key: string]: CSSProperties[keyof CSSProperties] | CSSObject | string;
};

// ----------------------------------------------------------------------

export type UseNavItemParams = Pick<
  NavItemProps,
  | "path"
  | "icon"
  | "info"
  | "depth"
  | "render"
  | "hasChild"
  | "externalLink"
  | "enabledRootRedirect"
>;

export type NavItemBaseLinkProps = {
  component?: ElementType;
  href?: string;
  target?: string;
  rel?: string;
};
