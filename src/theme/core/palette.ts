import COLORS from "./colors.json";
import { varAlpha, createPaletteChannel } from "../styles/utils";

// ----------------------------------------------------------------------

// Grey
export const grey = createPaletteChannel(COLORS.grey);

// Primary
export const primary = createPaletteChannel(COLORS.primary);

// Secondary
export const secondary = createPaletteChannel(COLORS.secondary);

// Info
export const info = createPaletteChannel(COLORS.info);

// Success
export const success = createPaletteChannel(COLORS.success);

// Warning
export const warning = createPaletteChannel(COLORS.warning);

// Error
export const error = createPaletteChannel(COLORS.error);

// Common
export const common = createPaletteChannel(COLORS.common);

// Primary — dark scheme uses lime for contrast on plum
export const primaryDark = createPaletteChannel({
  lighter: "#F8F9D6",
  light: "#F3F5B4",
  main: "#EEF091",
  dark: "#C9CB5E",
  darker: "#8E9034",
  contrastText: "#1E1220",
});

const secondaryDark = createPaletteChannel({
  lighter: "#E2FBF8",
  light: "#B0F4EC",
  main: "#7BECE0",
  dark: "#4FC9BC",
  darker: "#2A8F85",
  contrastText: "#1E1220",
});

// Text
// `disabled` carries real metadata across the site (post dates, reading time,
// view counts, card captions), so it has to clear WCAG AA 4.5:1 on every
// background of its scheme — grey[400]/grey[600] only reached ~2.4:1 and read
// as unreadable on the dark plum. Both values stay a visible step dimmer
// than `secondary`.
const text = {
  light: createPaletteChannel({
    primary: "#1E1220",
    secondary: "#6B4A60",
    disabled: "#6A625D",
  }),
  dark: createPaletteChannel({
    primary: "#FCF2E8",
    secondary: "#CDB8C4",
    disabled: "#A89EA3",
  }),
};

// Background
export const background = {
  light: createPaletteChannel({
    paper: "#FFFFFF",
    default: "#FCF2E8",
    neutral: "#F3E6DA",
  }),
  dark: createPaletteChannel({
    paper: "#43263B",
    default: "#351C2F",
    neutral: "#4A2B42",
  }),
};

// Action
const baseAction = {
  hover: varAlpha(grey["500Channel"], 0.08),
  selected: varAlpha(grey["500Channel"], 0.16),
  focus: varAlpha(grey["500Channel"], 0.24),
  disabled: varAlpha(grey["500Channel"], 0.8),
  disabledBackground: varAlpha(grey["500Channel"], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

const action = {
  light: { ...baseAction, active: grey[600] },
  dark: { ...baseAction, active: grey[500] },
};

/*
 * Base palette
 */
const basePalette = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  grey,
  common,
  divider: varAlpha(grey["500Channel"], 0.2),
  action,
};

const lightPalette = {
  ...basePalette,
  text: text.light,
  background: background.light,
  action: action.light,
};

const darkPalette = {
  ...basePalette,
  primary: primaryDark,
  secondary: secondaryDark,
  text: text.dark,
  background: background.dark,
  action: action.dark,
};

// ----------------------------------------------------------------------

export const colorSchemes = {
  light: { palette: lightPalette },
  dark: { palette: darkPalette },
};
