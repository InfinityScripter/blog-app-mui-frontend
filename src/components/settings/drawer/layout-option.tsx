import { stylesMode } from "src/theme/styles";
import ButtonBase from "@mui/material/ButtonBase";

import { LayoutOptionNav } from "./layout-option-nav";
import { LayoutOptionContent } from "./layout-option-content";

import type { LayoutOptionProps } from "./types";

// ----------------------------------------------------------------------

export function LayoutOption({
  option,
  selected,
  sx,
  ...other
}: LayoutOptionProps) {
  return (
    <ButtonBase
      disableRipple
      sx={{
        width: 1,
        height: 64,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: "var(--item-radius)",
        borderColor: "var(--item-border-color)",
        ...(option === "horizontal" && { flexDirection: "column" }),
        ...(selected && {
          boxShadow: "var(--item-active-shadow-light)",
          [stylesMode.dark]: {
            boxShadow: "var(--item-active-shadow-dark)",
          },
        }),
        ...sx,
      }}
      {...other}
    >
      <LayoutOptionNav option={option} selected={selected} />
      <LayoutOptionContent selected={selected} />
    </ButtonBase>
  );
}
