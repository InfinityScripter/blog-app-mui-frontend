import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

// ----------------------------------------------------------------------

export const StyledLegend = styled(Box)(({ theme }) => ({
  gap: 6,
  alignItems: "center",
  display: "inline-flex",
  justifyContent: "flex-start",
  fontSize: theme.typography.pxToRem(13),
  fontWeight: theme.typography.fontWeightMedium,
}));

export const StyledDot = styled(Box)(() => ({
  width: 12,
  height: 12,
  flexShrink: 0,
  display: "flex",
  borderRadius: "50%",
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "currentColor",
}));
