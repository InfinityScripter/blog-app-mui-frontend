import type { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export function getNavLabelStyles(theme: Theme) {
  return {
    display: "block",
    lineHeight: 1.27,
    color: "text.secondary",
    fontWeight: "fontWeightSemiBold",
    fontSize: theme.typography.pxToRem(11),
  };
}
