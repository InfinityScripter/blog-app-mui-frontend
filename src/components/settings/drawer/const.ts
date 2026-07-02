import COLORS from "src/theme/core/colors.json";
import { defaultFont } from "src/theme/core/typography";
import PRIMARY_COLOR from "src/theme/with-settings/primary-color.json";

import type { PresetOption } from "./types";
import type { SettingsState } from "../config-settings";

// ----------------------------------------------------------------------

export const PRESET_OPTIONS: PresetOption[] = [
  { name: "default", value: COLORS.primary.main },
  { name: "cyan", value: PRIMARY_COLOR.cyan.main },
  { name: "purple", value: PRIMARY_COLOR.purple.main },
  { name: "blue", value: PRIMARY_COLOR.blue.main },
  { name: "orange", value: PRIMARY_COLOR.orange.main },
  { name: "red", value: PRIMARY_COLOR.red.main },
];

export const NAV_COLOR_OPTIONS: SettingsState["navColor"][] = [
  "integrate",
  "apparent",
];

export const NAV_LAYOUT_OPTIONS: SettingsState["navLayout"][] = [
  "vertical",
  "horizontal",
  "mini",
];

// Alternatives must stay Cyrillic-capable — the site content is Russian.
export const FONT_OPTIONS: SettingsState["fontFamily"][] = [
  defaultFont,
  "Golos Text",
  "IBM Plex Sans",
  "Rubik",
];
