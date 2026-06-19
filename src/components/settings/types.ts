import { type SettingsState } from "./config-settings";

// ----------------------------------------------------------------------

/** Value exposed by `SettingsContext` — the settings state plus its controls. */
export interface SettingsContextValue extends SettingsState {
  canReset: boolean;
  onReset: () => void;
  onUpdate: (updateState: SettingsState | Partial<SettingsState>) => void;
  onUpdateField: <K extends keyof SettingsState>(
    name: K,
    updateValue: SettingsState[K],
  ) => void;
  openDrawer: boolean;
  onCloseDrawer: () => void;
  onToggleDrawer: () => void;
}

export type { SettingsState };
