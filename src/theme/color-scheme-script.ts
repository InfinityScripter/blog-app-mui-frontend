import { defaultSettings } from "src/components/settings";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";

// ----------------------------------------------------------------------

// Shared no-flash color-scheme config: consumed by the root layout (renders
// <InitColorSchemeScript> before hydration) and the ThemeProvider (same keys),
// so the pre-paint script and the runtime provider agree on storage key + mode.
type SchemeConfig = React.ComponentProps<typeof InitColorSchemeScript>;

export const schemeConfig: SchemeConfig = {
  modeStorageKey: "theme-mode",
  defaultMode: defaultSettings.colorScheme,
};
