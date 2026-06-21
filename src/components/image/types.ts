import type { BoxProps } from "@mui/material/Box";
import type { ReactElement, HTMLAttributes } from "react";
import type { Theme, SxProps } from "@mui/material/styles";

// ----------------------------------------------------------------------

export interface ImageProps extends Omit<BoxProps, "component" | "ref"> {
  ratio?: string;
  disabledEffect?: boolean;
  alt?: string;
  src?: string;
  delayTime?: number;
  threshold?: number;
  beforeLoad?: () => void;
  delayMethod?: "debounce" | "throttle";
  placeholder?: ReactElement;
  wrapperProps?: HTMLAttributes<HTMLSpanElement>;
  scrollPosition?: { x: number; y: number };
  effect?: "blur" | "black-and-white" | "opacity" | string;
  visibleByDefault?: boolean;
  wrapperClassName?: string;
  useIntersectionObserver?: boolean;
  slotProps?: {
    overlay?: SxProps<Theme>;
  };
}
