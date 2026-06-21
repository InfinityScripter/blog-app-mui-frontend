import type { IconButtonProps } from "@mui/material/IconButton";

import { varAlpha } from "src/theme/styles";
import IconButton from "@mui/material/IconButton";

import { Iconify } from "../../iconify";

// ----------------------------------------------------------------------

export function DeleteButton({ sx, ...other }: IconButtonProps) {
  return (
    <IconButton
      size="small"
      sx={{
        top: 16,
        right: 16,
        zIndex: 9,
        position: "absolute",
        color: (theme) => varAlpha(theme.vars.palette.common.whiteChannel, 0.8),
        bgcolor: (theme) =>
          varAlpha(theme.vars.palette.grey["900Channel"], 0.72),
        "&:hover": {
          bgcolor: (theme) =>
            varAlpha(theme.vars.palette.grey["900Channel"], 0.48),
        },
        ...sx,
      }}
      {...other}
    >
      <Iconify icon="mingcute:close-line" width={18} />
    </IconButton>
  );
}
