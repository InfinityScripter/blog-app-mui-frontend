import type { Theme, SxProps } from "@mui/material/styles";
import type { ColorType } from "src/theme/core/components/types";
import type {
  Transition,
  TargetAndTransition,
  LegacyAnimationControls,
} from "framer-motion";

// ----------------------------------------------------------------------

export interface DotProps {
  color?: ColorType;
  animate?: LegacyAnimationControls | TargetAndTransition;
  transition?: Transition;
  sx?: SxProps<Theme>;
}

export interface LinesProps {
  strokeCount: number;
}

export interface TextsProps {
  sx?: SxProps<Theme>;
}
