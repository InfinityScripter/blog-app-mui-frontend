import type { Theme, SxProps } from "@mui/material/styles";

import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

// Filled email input styled for the dark newsletter panel: white-alpha fill,
// light text/placeholder, primary focus ring. Kept out of the JSX per the
// sections guideline (pure sx helper, no logic).
export const darkFieldSx: SxProps<Theme> = {
  "& .MuiFilledInput-root": {
    color: "common.white",
    borderRadius: 1.5,
    bgcolor: (theme) => alpha(theme.palette.common.white, 0.08),
    "&:hover": {
      bgcolor: (theme) => alpha(theme.palette.common.white, 0.12),
    },
    "&.Mui-focused": {
      bgcolor: (theme) => alpha(theme.palette.common.white, 0.12),
    },
    "&:before, &:after": { display: "none" },
  },
  "& .MuiInputBase-input::placeholder": {
    color: (theme) => alpha(theme.palette.common.white, 0.5),
    opacity: 1,
  },
};
