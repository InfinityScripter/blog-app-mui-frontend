import "@mui/material/styles";

// ----------------------------------------------------------------------

/**
 * MUI v7 dropped the TypeScript declaration for the deprecated
 * `experimental_extendTheme` export, but the runtime function is still
 * shipped (it is a thin wrapper around the stabilized `extendTheme`). This
 * project intentionally keeps calling the existing runtime symbol, so we
 * re-declare its type as an alias of the stable `extendTheme` to keep the
 * import type-checked without changing any runtime behavior.
 */
declare module "@mui/material/styles" {
  export const experimental_extendTheme: typeof import("@mui/material/styles").extendTheme;
}
