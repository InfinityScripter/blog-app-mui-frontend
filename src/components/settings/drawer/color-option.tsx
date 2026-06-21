import Box from "@mui/material/Box";
import { CONFIG } from "src/config-global";
import { stylesMode } from "src/theme/styles";
import ButtonBase from "@mui/material/ButtonBase";

import { SvgColor, svgColorClasses } from "../../svg-color";

import type { ColorOptionProps } from "./types";

// ----------------------------------------------------------------------

export function ColorOption({
  option,
  selected,
  sx,
  ...other
}: ColorOptionProps) {
  return (
    <ButtonBase
      disableRipple
      sx={{
        gap: 1.5,
        width: 1,
        height: 56,
        color: "text.disabled",
        borderRadius: "var(--item-radius)",
        ...(selected && {
          borderWidth: 1,
          borderStyle: "solid",
          color: "text.primary",
          borderColor: "var(--item-border-color)",
          boxShadow: "var(--item-active-shadow-light)",
          [`& .${svgColorClasses.root}`]: {
            background: "var(--item-active-color)",
          },
          [stylesMode.dark]: {
            boxShadow: "var(--item-active-shadow-dark)",
          },
        }),
        ...sx,
      }}
      {...other}
    >
      <SvgColor
        src={`${CONFIG.site.basePath}/assets/icons/setting/ic-sidebar-${
          option === "integrate" ? "outline" : "filled"
        }.svg`}
      />

      <Box
        component="span"
        sx={{
          lineHeight: "18px",
          textTransform: "capitalize",
          fontWeight: "fontWeightSemiBold",
          fontSize: (theme) => theme.typography.pxToRem(13),
        }}
      >
        {option}
      </Box>
    </ButtonBase>
  );
}
