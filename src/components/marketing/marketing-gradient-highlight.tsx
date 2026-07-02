import Box from "@mui/material/Box";

import type { MarketingGradientHighlightProps } from "./types";

// ----------------------------------------------------------------------

/**
 * Акцентное слово в маркетинговом заголовке. Editorial Ink: один сплошной
 * цветовой акцент (primary) вместо прежнего анимированного градиента.
 */
export const MarketingGradientHighlight = ({
  children,
}: MarketingGradientHighlightProps) => (
  <Box
    component="span"
    sx={{ color: "primary.main", ml: { xs: 0.75, md: 1, xl: 1.5 } }}
  >
    {children}
  </Box>
);
