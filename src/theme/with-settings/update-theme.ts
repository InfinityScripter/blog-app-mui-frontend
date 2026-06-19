import type { SettingsState } from "src/types/domain";

import COLORS from "../core/colors.json";
import PRIMARY_COLOR from "./primary-color.json";
import { components as coreComponents } from "../core/components";
import { hexToRgbChannel, createPaletteChannel } from "../styles";
import {
  grey as coreGreyPalette,
  primary as corePrimaryPalette,
} from "../core/palette";
import {
  createShadowColor,
  customShadows as coreCustomShadows,
} from "../core/custom-shadows";

import type { CustomShadows } from "../core/custom-shadows";
import type { ThemeWithVars } from "../core/components/types";

// ----------------------------------------------------------------------

/**
 * The theme-options object assembled in `create-theme.ts` before it is handed
 * to `extendTheme`. It carries the app's concrete `colorSchemes` plus the
 * custom `customShadows` field, neither of which is shaped like the strict MUI
 * `CssVarsThemeOptions`, so this helper types only the fields it reads/writes
 * and passes the rest through. The assembled object is validated by
 * `extendTheme` at the call site in `create-theme.ts`.
 */
type PaletteInput = Record<string, unknown>;

type ColorSchemesInput = {
  light?: { palette?: PaletteInput };
  dark?: { palette?: PaletteInput };
};

type ThemeInput = Record<string, unknown> & {
  colorSchemes?: ColorSchemesInput;
  customShadows?: CustomShadows;
};

/**
 * [1] settings @primaryColor
 * [2] settings @contrast
 */

export function updateCoreWithSettings(
  theme: ThemeInput,
  settings: SettingsState,
): ThemeInput {
  const { colorSchemes, customShadows } = theme;

  return {
    ...theme,
    colorSchemes: {
      ...colorSchemes,
      light: {
        palette: {
          ...colorSchemes?.light?.palette,
          /** [1] */
          primary: getPalettePrimary(settings.primaryColor),
          /** [2] */
          background: {
            ...(colorSchemes?.light?.palette?.background as PaletteInput),
            default: getBackgroundDefault(settings.contrast),
            defaultChannel: hexToRgbChannel(
              getBackgroundDefault(settings.contrast),
            ),
          },
        },
      },
      dark: {
        palette: {
          ...colorSchemes?.dark?.palette,
          /** [1] */
          primary: getPalettePrimary(settings.primaryColor),
        },
      },
    },
    customShadows: {
      ...(customShadows ?? {}),
      /** [1] */
      primary:
        settings.primaryColor === "default"
          ? coreCustomShadows("light").primary
          : createShadowColor(
              getPalettePrimary(settings.primaryColor).mainChannel,
            ),
    },
  } as ThemeInput;
}

// ----------------------------------------------------------------------

export function updateComponentsWithSettings(settings: SettingsState): {
  components: Record<string, unknown>;
} {
  const components: Record<string, unknown> = {};

  /** [2] */
  if (settings.contrast === "bold") {
    const MuiCard = {
      styleOverrides: {
        root: ({ theme }: { theme: ThemeWithVars }) => {
          let rootStyles: Record<string, unknown> = {};
          if (
            typeof coreComponents?.MuiCard?.styleOverrides?.root === "function"
          ) {
            rootStyles =
              (coreComponents.MuiCard.styleOverrides.root({
                theme,
              }) as Record<string, unknown>) ?? {};
          }

          return {
            ...rootStyles,
            boxShadow: theme.customShadows.z1,
          };
        },
      },
    };

    components.MuiCard = MuiCard;
  }

  return { components };
}

// ----------------------------------------------------------------------

const PRIMARY_COLORS: Record<string, Record<string, string>> = {
  default: COLORS.primary,
  cyan: PRIMARY_COLOR.cyan,
  purple: PRIMARY_COLOR.purple,
  blue: PRIMARY_COLOR.blue,
  orange: PRIMARY_COLOR.orange,
  red: PRIMARY_COLOR.red,
};

function getPalettePrimary(
  primaryColorName: SettingsState["primaryColor"],
): Record<string, string> {
  /** [1] */
  const selectedPrimaryColor =
    PRIMARY_COLORS[primaryColorName] || PRIMARY_COLORS.default;
  const updatedPrimaryPalette = createPaletteChannel(selectedPrimaryColor);

  return primaryColorName === "default"
    ? corePrimaryPalette
    : updatedPrimaryPalette;
}

function getBackgroundDefault(contrast: SettingsState["contrast"]): string {
  /** [2] */
  return contrast === "default" ? "#FFFFFF" : coreGreyPalette[200];
}
