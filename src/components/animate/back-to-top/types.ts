import type { FabProps } from "@mui/material/Fab";
import type { Theme, SxProps } from "@mui/material/styles";

// ----------------------------------------------------------------------

export interface BackToTopProps extends Omit<FabProps, "sx"> {
  value?: number;
  sx?: SxProps<Theme>;
}
