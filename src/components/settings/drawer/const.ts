import COLORS from "src/theme/core/colors.json";
import PRIMARY_COLOR from "src/theme/with-settings/primary-color.json";

import type { PresetOption } from "./types";

// ----------------------------------------------------------------------

export const PRESET_OPTIONS: PresetOption[] = [
  { name: "default", value: COLORS.primary.main },
  { name: "cyan", value: PRIMARY_COLOR.cyan.main },
  { name: "purple", value: PRIMARY_COLOR.purple.main },
  { name: "blue", value: PRIMARY_COLOR.blue.main },
  { name: "orange", value: PRIMARY_COLOR.orange.main },
  { name: "red", value: PRIMARY_COLOR.red.main },
];
