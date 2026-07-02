import type { SettingsState } from "src/types/domain";

import {
  type Theme,
  experimental_extendTheme as extendTheme,
} from "@mui/material/styles";

import { setFont } from "./styles/utils";
import { overridesTheme } from "./overrides-theme";
import {
  shadows,
  typography,
  components,
  colorSchemes,
  customShadows,
} from "./core";
import {
  updateCoreWithSettings,
  updateComponentsWithSettings,
} from "./with-settings/update-theme";

// ----------------------------------------------------------------------

export function createTheme(settings: SettingsState): Theme {
  // This is a CSS-vars theme (extendTheme + class color-scheme selector): both
  // light and dark schemes are generated and the active one is toggled at
  // runtime by CssVarsProvider, and direction is applied by the <RTL> wrapper.
  // So `shadows`/`customShadows` here only seed the base (non-scheme) values and
  // `direction` only sets the theme-object field — both wired to the real
  // settings for consistency.
  const { colorScheme, direction } = settings;

  const initialTheme = {
    colorSchemes,
    shadows: shadows(colorScheme),
    customShadows: customShadows(colorScheme),
    direction,
    shape: { borderRadius: 10 },
    components,
    typography: {
      ...typography,
      fontFamily: setFont(settings.fontFamily),
    },
    colorSchemeSelector: "class",
    cssVarPrefix: "",
    shouldSkipGeneratingVar,
  };

  /**
   * 1.Update values from settings before creating theme.
   */
  const updateTheme = updateCoreWithSettings(initialTheme, settings);

  /**
   * 2.Create theme + add locale + update component with settings.
   */
  const theme = extendTheme(
    updateTheme,
    updateComponentsWithSettings(settings),
    overridesTheme,
  );

  return theme;
}

// ----------------------------------------------------------------------

function shouldSkipGeneratingVar(keys: string[], _value: unknown): boolean {
  const skipGlobalKeys = [
    "mixins",
    "overlays",
    "direction",
    "breakpoints",
    "cssVarPrefix",
    "unstable_sxConfig",
    "typography",
    // 'transitions',
  ];

  const skipPaletteKeys: Record<string, string[]> = {
    global: ["tonalOffset", "dividerChannel", "contrastThreshold"],
    grey: ["A100", "A200", "A400", "A700"],
    text: ["icon"],
  };

  const isPaletteKey = keys[0] === "palette";

  if (isPaletteKey) {
    const paletteType = keys[1];
    const skipKeys = skipPaletteKeys[paletteType] || skipPaletteKeys.global;

    return keys.some((key) => skipKeys?.includes(key));
  }

  return keys.some((key) => skipGlobalKeys?.includes(key));
}

/**
* createTheme without @settings and @locale components.
*
 ```jsx
export function createTheme(): Theme {
  const initialTheme = {
    colorSchemes,
    shadows: shadows('light'),
    customShadows: customShadows('light'),
    shape: { borderRadius: 8 },
    components,
    typography,
    cssVarPrefix: '',
    shouldSkipGeneratingVar,
  };

  const theme = extendTheme(initialTheme, overridesTheme);

  return theme;
}
 ```
*/
