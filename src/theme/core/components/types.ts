import type { Theme } from "@mui/material/styles";

import type { CustomShadows } from "../custom-shadows";

// ----------------------------------------------------------------------

/**
 * The named palette colors used by component overrides when indexing
 * `theme.vars.palette[color]` (e.g. `theme.vars.palette.primary`).
 */
export type ColorType =
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error";

/**
 * Custom typography tokens defined by the app in `src/theme/core/typography.ts`
 * (e.g. `fontWeightSemiBold`, `fontSecondaryFamily`). The base MUI
 * `TypographyVariants` type does not know about them.
 */
interface CustomTypography {
  fontWeightSemiBold: number | string;
  fontSecondaryFamily: string;
}

/**
 * The app builds its theme with `extendTheme` and attaches `customShadows`
 * plus the custom typography tokens above. The base MUI `Theme` exposes
 * neither, so component overrides reading `theme.customShadows.*` or
 * `theme.typography.fontWeightSemiBold` use this intersection for accurate
 * typing. Use it wherever a callback touches those app-specific fields.
 */
export type ThemeWithVars = Theme & {
  customShadows: CustomShadows;
  typography: Theme["typography"] & CustomTypography;
};
