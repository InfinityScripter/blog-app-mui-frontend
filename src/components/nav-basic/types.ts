import type { Theme, SxProps, CSSObject } from "@mui/material/styles";

export type {
  NavSlotProps,
  NavItemProps,
  NavItemSlotProps,
  NavItemBaseProps,
  NavItemStateProps,
  NavItemRenderProps,
} from "../nav-section/types";

import type {
  NavSlotProps,
  NavItemBaseProps,
  NavItemRenderProps,
} from "../nav-section/types";

// ----------------------------------------------------------------------

export type NavListProps = {
  data: NavItemBaseProps;
  depth: number;
  render?: NavItemRenderProps;
  cssVars?: CSSObject;
  slotProps?: NavSlotProps;
  enabledRootRedirect?: boolean;
};

export type NavSubListProps = Omit<NavListProps, "data"> & {
  data: NavItemBaseProps[];
};

export type NavBasicProps = {
  sx?: SxProps<Theme>;
  data: NavItemBaseProps[];
  render?: NavItemRenderProps;
  cssVars?: CSSObject;
  slotProps?: NavSlotProps;
  enabledRootRedirect?: boolean;
};
