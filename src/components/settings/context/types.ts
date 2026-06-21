import type { ReactNode } from "react";

import { type SettingsState } from "../config-settings";

// ----------------------------------------------------------------------

export interface SettingsProviderProps {
  children: ReactNode;
  settings: SettingsState;
  caches?: "localStorage" | "cookie";
}
