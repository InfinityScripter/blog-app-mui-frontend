import { defaultFont } from "src/theme/core/typography";

// ----------------------------------------------------------------------

export const STORAGE_KEY = "app-settings";

export interface SettingsState {
  colorScheme: "light" | "dark" | "system";
  direction: "ltr" | "rtl";
  contrast: "default" | "hight";
  navLayout: "vertical" | "horizontal" | "mini";
  primaryColor: "default" | "cyan" | "purple" | "blue" | "orange" | "red";
  navColor: "integrate" | "apparent";
  compactLayout: boolean;
  fontFamily: string;
}

export const defaultSettings: SettingsState = {
  colorScheme: "light",
  direction: "ltr",
  contrast: "default",
  navLayout: "vertical",
  primaryColor: "default",
  navColor: "integrate",
  compactLayout: true,
  fontFamily: defaultFont,
};
