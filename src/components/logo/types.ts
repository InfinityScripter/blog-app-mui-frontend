import type { BoxProps } from "@mui/material/Box";
import type { RouterLink } from "src/routes/components";

// ----------------------------------------------------------------------

export interface LogoProps
  extends Omit<BoxProps<typeof RouterLink>, "component" | "href"> {
  width?: number | string;
  height?: number | string;
  disableLink?: boolean;
  href?: string;
  variant?: "full" | "mark" | "wordmark";
}
