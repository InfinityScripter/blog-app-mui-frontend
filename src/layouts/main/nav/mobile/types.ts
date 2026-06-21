import type { ReactNode } from "react";
import type { Theme, SxProps } from "@mui/material/styles";

import type { MainNavItem } from "../types";

// ----------------------------------------------------------------------

export interface StyledNavItemProps {
  active?: boolean;
  open?: boolean;
}

export interface NavListProps {
  data: MainNavItem;
}

export interface NavMobileProps {
  data: MainNavItem[];
  open: boolean;
  onClose: () => void;
  slots?: {
    topArea?: ReactNode;
    bottomArea?: ReactNode;
  };
  sx?: SxProps<Theme>;
}
