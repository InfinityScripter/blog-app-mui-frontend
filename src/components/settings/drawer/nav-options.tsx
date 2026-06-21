import { varAlpha } from "src/theme/styles";
import { useTheme } from "@mui/material/styles";

import { Block } from "./block";
import { NavOptionsColor } from "./nav-options-color";
import { NavOptionsLayout } from "./nav-options-layout";

import type { NavOptionsProps } from "./types";

// ----------------------------------------------------------------------

export function NavOptions({
  options,
  value,
  onClickOption,
  hideNavColor,
  hideNavLayout,
}: NavOptionsProps) {
  const theme = useTheme();

  const cssVars = {
    "--item-radius": "12px",
    "--item-bg": theme.vars.palette.grey[500],
    "--item-border-color": varAlpha(
      theme.vars.palette.grey["500Channel"],
      0.08,
    ),
    "--item-active-color": `linear-gradient(135deg, ${theme.vars.palette.primary.light} 0%, ${theme.vars.palette.primary.main} 100%)`,
    "--item-active-shadow-light": `-8px 8px 20px -4px ${varAlpha(
      theme.vars.palette.grey["500Channel"],
      0.12,
    )}`,
    "--item-active-shadow-dark": `-8px 8px 20px -4px ${varAlpha(
      theme.vars.palette.common.blackChannel,
      0.12,
    )}`,
  };

  return (
    <Block title="Nav" tooltip="Dashboard only" sx={{ ...cssVars, gap: 2.5 }}>
      {!hideNavLayout && (
        <NavOptionsLayout
          options={options.layouts}
          value={value.layout}
          onClickOption={onClickOption.layout}
        />
      )}
      {!hideNavColor && (
        <NavOptionsColor
          options={options.colors}
          value={value.color}
          onClickOption={onClickOption.color}
        />
      )}
    </Block>
  );
}
