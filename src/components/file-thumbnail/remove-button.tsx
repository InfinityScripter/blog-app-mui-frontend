import type { IconButtonProps } from "@mui/material/IconButton";

import { varAlpha } from "src/theme/styles";
import IconButton from "@mui/material/IconButton";

import { Iconify } from "../iconify";

// ----------------------------------------------------------------------

export function RemoveButton({ sx, ...other }: IconButtonProps) {
  return (
    <IconButton
      size="small"
      sx={{
        p: 0.35,
        top: 4,
        right: 4,
        position: "absolute",
        color: "common.white",
        bgcolor: (theme) =>
          varAlpha(theme.vars.palette.grey["900Channel"], 0.48),
        "&:hover": {
          bgcolor: (theme) =>
            varAlpha(theme.vars.palette.grey["900Channel"], 0.72),
        },
        ...sx,
      }}
      {...other}
    >
      <Iconify icon="mingcute:close-line" width={12} />
    </IconButton>
  );
}
