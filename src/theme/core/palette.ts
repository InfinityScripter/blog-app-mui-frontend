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

// Primary — dark scheme uses a brighter vermilion for contrast on charcoal
export const primaryDark = createPaletteChannel({
  lighter: "#FBE3D9",
  light: "#F2926B",
  main: "#E06032",
  dark: "#C2451E",
  darker: "#9A3412",
  contrastText: "#FFFFFF",
});

// Text
// `disabled` carries real metadata across the site (post dates, reading time,
// view counts, card captions), so it has to clear WCAG AA 4.5:1 on every
// background of its scheme — grey[400]/grey[600] only reached ~2.4:1 and read
// as unreadable on the dark charcoal. Both values stay a visible step dimmer
// than `secondary`.
const text = {
  light: createPaletteChannel({
    primary: grey[900],
    secondary: grey[600],
    disabled: "#726B65",
  }),
  dark: createPaletteChannel({
    primary: "#F5F5F4",
    secondary: grey[400],
    disabled: "#938B85",
  }),
};

// Background
const background = {
  light: createPaletteChannel({
    paper: "#FFFFFF",
    default: grey[50],
    neutral: grey[100],
  }),
  dark: createPaletteChannel({
    paper: grey[900],
    default: "#141210",
    neutral: "#262220",
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
  text: text.dark,
  background: background.dark,
  action: action.dark,
};

// ----------------------------------------------------------------------

export const colorSchemes = {
  light: { palette: lightPalette },
  dark: { palette: darkPalette },
};
