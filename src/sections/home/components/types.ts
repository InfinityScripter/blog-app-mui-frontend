import type { Theme } from "@mui/material/styles";
import type { ThemeWithVars } from "src/theme/core/components/types";

// ----------------------------------------------------------------------

/**
 * App-specific theme fields used across the marketing/home sections that the
 * base MUI `Theme` types do not expose. The runtime theme (built with
 * `extendTheme` in `src/theme`) provides all of these — these augmentations
 * are missing from the base types, so we narrow locally instead of casting to
 * `any`.
 *
 * Shared-type gap: `background.neutral` and the palette `lighter`/`darker`
 * channel colors are real runtime tokens but are not declared in
 * `src/types/mui-variants.d.ts`. See the report notes.
 */
type WithLighterDarker<T> = T & { lighter: string; darker: string };

type MarketingPalette = Omit<
  Theme["palette"],
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "background"
> & {
  primary: WithLighterDarker<Theme["palette"]["primary"]>;
  secondary: WithLighterDarker<Theme["palette"]["secondary"]>;
  info: WithLighterDarker<Theme["palette"]["info"]>;
  success: WithLighterDarker<Theme["palette"]["success"]>;
  warning: WithLighterDarker<Theme["palette"]["warning"]>;
  error: WithLighterDarker<Theme["palette"]["error"]>;
  background: Theme["palette"]["background"] & { neutral: string };
};

type ThemeVars = NonNullable<Theme["vars"]>;

type MarketingVarsPalette = Omit<
  ThemeVars["palette"],
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "background"
> & {
  primary: WithLighterDarker<ThemeVars["palette"]["primary"]>;
  secondary: WithLighterDarker<ThemeVars["palette"]["secondary"]>;
  info: WithLighterDarker<ThemeVars["palette"]["info"]>;
  success: WithLighterDarker<ThemeVars["palette"]["success"]>;
  warning: WithLighterDarker<ThemeVars["palette"]["warning"]>;
  error: WithLighterDarker<ThemeVars["palette"]["error"]>;
  background: ThemeVars["palette"]["background"] & { neutral: string };
};

/**
 * `ThemeWithVars` (from the theme package) adds `customShadows` and the custom
 * typography tokens (`fontSecondaryFamily`). On top of that the marketing
 * sections also read `palette.background.neutral` and the palette
 * `lighter`/`darker` colors — both on `theme.palette` and on the CSS-vars
 * `theme.vars.palette` — so we extend both here.
 */
export type MarketingTheme = ThemeWithVars & {
  palette: MarketingPalette;
  vars: ThemeVars & { palette: MarketingVarsPalette };
};
