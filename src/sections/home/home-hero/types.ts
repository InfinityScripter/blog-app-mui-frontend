import type { Theme } from "@mui/material/styles";
import type { BoxProps } from "@mui/material/Box";
import type { ReactNode, ElementType } from "react";

// ----------------------------------------------------------------------

export interface MInviewProps {
  children?: ReactNode;
  component?: ElementType;
}

export interface HeroContentProps {
  theme: Theme;
}

export type HomeHeroProps = BoxProps;
