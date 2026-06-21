import type { ButtonBaseProps } from "@mui/material/ButtonBase";

import { useTheme } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import { bgBlur, varAlpha } from "src/theme/styles";

import { Iconify } from "../iconify";

// ----------------------------------------------------------------------

export function DownloadButton({ sx, ...other }: ButtonBaseProps) {
  const theme = useTheme();

  return (
    <ButtonBase
      sx={{
        p: 0,
        top: 0,
        right: 0,
        width: 1,
        height: 1,
        zIndex: 9,
        opacity: 0,
        position: "absolute",
        color: "common.white",
        borderRadius: "inherit",
        transition: theme.transitions.create(["opacity"]),
        "&:hover": {
          ...bgBlur({
            color: varAlpha(theme.vars.palette.grey["900Channel"], 0.64),
          }),
          opacity: 1,
        },
        ...sx,
      }}
      {...other}
    >
      <Iconify icon="eva:arrow-circle-down-fill" width={24} />
    </ButtonBase>
  );
}
