import "@mui/material/Button";
import "@mui/material/ButtonGroup";
import "@mui/material/Chip";
import "@mui/material/Fab";
import "@mui/material/Pagination";
import type { Theme as MuiTheme } from "@mui/material/styles";
import type { CustomShadows } from "src/theme/core/custom-shadows";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    soft: true;
  }
}

declare module "@mui/material/styles" {
  interface DefaultTheme {
    customShadows: CustomShadows;
  }

  // The app builds its theme with `extendTheme` (CSS-vars theme), so `theme.vars`
  // is always present at runtime. The base MUI `Theme` types it as optional,
  // which produced ~280 "theme.vars is possibly undefined" errors across the
  // template. Make it required to match reality.
  interface Theme {
    vars: NonNullable<MuiTheme["vars"]>;
  }
}

declare module "@mui/material/ButtonGroup" {
  interface ButtonGroupPropsVariantOverrides {
    soft: true;
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsVariantOverrides {
    soft: true;
  }
}

declare module "@mui/material/Fab" {
  interface FabPropsVariantOverrides {
    soft: true;
  }
}

declare module "@mui/material/Pagination" {
  interface PaginationPropsVariantOverrides {
    soft: true;
  }
}
