import type { BoxProps } from "@mui/material/Box";
import type { LinkProps } from "@mui/material/Link";
import type { Theme, SxProps } from "@mui/material/styles";
import type { ButtonBaseProps } from "@mui/material/ButtonBase";
import type { ReactNode, ReactElement, CSSProperties } from "react";

import type {
  NavItemSlotProps,
  NavItemStateProps,
  NavItemRenderProps,
} from "../nav-section/types";

// ----------------------------------------------------------------------

type CSSObject = {
  [key: string]: CSSProperties[keyof CSSProperties] | CSSObject | string;
};

export type MegaMenuCarouselSlide = {
  name: string;
  path: string;
  coverUrl: string;
};

export type MegaMenuTag = {
  title: string;
  path: string;
};

export type MegaMenuMoreLink = {
  title: string;
  path: string;
};

export type MegaMenuSubItem = {
  title: string;
  path: string;
};

export type MegaMenuGroup = {
  subheader?: string;
  items: MegaMenuSubItem[];
};

export type MegaMenuItemBaseProps = {
  title?: string;
  path: string;
  icon?: ReactNode;
  info?: ReactNode;
  disabled?: boolean;
  children?: MegaMenuGroup[];
  slides?: MegaMenuCarouselSlide[];
  tags?: MegaMenuTag[];
  moreLink?: MegaMenuMoreLink;
};

export type MegaMenuSlotProps = {
  rootItem?: NavItemSlotProps;
  subItem?: SxProps<Theme>;
  subheader?: SxProps<Theme>;
  paper?: SxProps<Theme>;
  moreLink?: SxProps<Theme>;
  tags?: SxProps<Theme>;
  carousel?: {
    displayCount?: number;
    sx?: SxProps<Theme>;
  };
};

export type MegaMenuNavItemProps = Omit<
  ButtonBaseProps,
  "title" | "disabled" | "slotProps"
> &
  NavItemStateProps &
  Omit<MegaMenuItemBaseProps, "children"> & {
    render?: NavItemRenderProps;
    slotProps?: NavItemSlotProps;
  };

export type MegaMenuNavListProps = {
  data: MegaMenuItemBaseProps;
  render?: NavItemRenderProps;
  cssVars?: CSSObject;
  slotProps?: MegaMenuSlotProps;
  enabledRootRedirect?: boolean;
};

export type MegaMenuProps = {
  sx?: SxProps<Theme>;
  data: MegaMenuItemBaseProps[];
  render?: NavItemRenderProps;
  cssVars?: CSSObject;
  slotProps?: MegaMenuSlotProps;
  enabledRootRedirect?: boolean;
};

export type MegaMenuMobileProps = MegaMenuProps & {
  slots?: {
    button?: ReactElement<{ onClick?: () => void }>;
    topArea?: ReactNode;
    bottomArea?: ReactNode;
  };
};

export type NavContentProps = {
  data: MegaMenuItemBaseProps;
  slotProps?: MegaMenuSlotProps;
  singleList?: boolean;
};

export type NavSubListProps = {
  data: MegaMenuGroup[];
  slotProps?: MegaMenuSlotProps;
};

export type NavSubItemProps = {
  title: string;
  path: string;
  active?: boolean;
  slotProps?: SxProps<Theme>;
};

export type MenuCarouselProps = {
  slides: MegaMenuCarouselSlide[];
  displayCount?: number;
  sx?: SxProps<Theme>;
};

export type MenuMoreLinkProps = Omit<LinkProps, "title"> & {
  title: string;
  path: string;
};

export type MenuTagsProps = BoxProps & {
  tags: MegaMenuTag[];
};
