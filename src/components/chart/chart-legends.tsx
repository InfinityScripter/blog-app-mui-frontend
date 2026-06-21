import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { StyledDot, StyledLegend } from "./styles";

import type { ChartLegendsProps } from "./types";

// ----------------------------------------------------------------------

export { StyledDot, StyledLegend } from "./styles";

export function ChartLegends({
  labels = [],
  colors = [],
  values,
  sublabels,
  icons,
  ...other
}: ChartLegendsProps) {
  return (
    <Stack direction="row" flexWrap="wrap" spacing={2} {...other}>
      {labels?.map((series, index) => (
        <Stack key={series} spacing={1}>
          <StyledLegend>
            {icons?.length ? (
              <Box
                component="span"
                sx={{
                  color: colors[index],
                  "& svg, & img": { width: 20, height: 20 },
                }}
              >
                {icons?.[index]}
              </Box>
            ) : (
              <StyledDot as="span" sx={{ color: colors[index] }} />
            )}

            <Box component="span" sx={{ flexShrink: 0 }}>
              {series}
              {sublabels && <> {` (${sublabels[index]})`}</>}
            </Box>
          </StyledLegend>

          {values && <Box sx={{ typography: "h6" }}>{values[index]}</Box>}
        </Stack>
      ))}
    </Stack>
  );
}
