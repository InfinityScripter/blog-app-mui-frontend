import Box from "@mui/material/Box";
import { varAlpha } from "src/theme/styles";
import { useTheme } from "@mui/material/styles";

import { Block } from "./styles";
import { ColorOption } from "./color-option";
import { LayoutOption } from "./layout-option";

import type { NavOptionsProps } from "./types";

// Re-exported so importers keep resolving these from this module.
export { ColorOption } from "./color-option";
export { LayoutOption } from "./layout-option";

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

  const labelStyles = {
    display: "block",
    lineHeight: "14px",
    color: "text.secondary",
    fontWeight: "fontWeightSemiBold",
    fontSize: theme.typography.pxToRem(11),
  };

  const renderLayout = (
    <div>
      <Box component="span" sx={labelStyles}>
        Layout
      </Box>
      <Box gap={1.5} display="flex" sx={{ mt: 1.5 }}>
        {options.layouts.map((option) => (
          <LayoutOption
            key={option}
            option={option}
            selected={value.layout === option}
            onClick={() => onClickOption.layout(option)}
          />
        ))}
      </Box>
    </div>
  );

  const renderColor = (
    <div>
      <Box component="span" sx={labelStyles}>
        Color
      </Box>
      <Box gap={1.5} display="flex" sx={{ mt: 1.5 }}>
        {options.colors.map((option) => (
          <ColorOption
            key={option}
            option={option}
            selected={value.color === option}
            onClick={() => onClickOption.color(option)}
          />
        ))}
      </Box>
    </div>
  );

  return (
    <Block title="Nav" tooltip="Dashboard only" sx={{ ...cssVars, gap: 2.5 }}>
      {!hideNavLayout && renderLayout}
      {!hideNavColor && renderColor}
    </Block>
  );
}
