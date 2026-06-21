import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { varAlpha } from "src/theme/styles";
import { useTheme } from "@mui/material/styles";

import { mergeSx } from "./utils";
import { ArrowButton } from "./arrow-button";
import { carouselClasses } from "../classes";

import type { CarouselArrowNumberButtonsProps } from "./types";

// ----------------------------------------------------------------------

export function CarouselArrowNumberButtons({
  options,
  slotProps,
  totalSlides,
  selectedIndex,

  //
  onClickPrev,

  onClickNext,
  disablePrev,
  disableNext,
  sx,
  ...other
}: CarouselArrowNumberButtonsProps) {
  const theme = useTheme();
  const grey900Channel = theme.vars.palette.grey["900Channel"];

  return (
    <Stack
      direction="row"
      alignItems="center"
      display="inline-flex"
      className={carouselClasses.arrows}
      sx={{
        p: 0.5,
        gap: 0.25,
        zIndex: 9,
        borderRadius: 1.25,
        color: "common.white",
        bgcolor: varAlpha(grey900Channel, 0.48),
        ...sx,
      }}
      {...other}
    >
      <ArrowButton
        variant="prev"
        options={options}
        disabled={disablePrev}
        onClick={onClickPrev}
        sx={mergeSx(
          { p: 0.75, borderRadius: "inherit" },
          slotProps?.prevBtn?.sx,
        )}
        svgIcon={slotProps?.prevBtn?.svgIcon}
        svgSize={slotProps?.prevBtn?.svgSize ?? 16}
      />

      <Box
        component="span"
        className={carouselClasses.arrowsLabel}
        sx={{ mx: 0.5, typography: "subtitle2" }}
      >
        {selectedIndex}/{totalSlides}
      </Box>

      <ArrowButton
        variant="next"
        options={options}
        disabled={disableNext}
        onClick={onClickNext}
        sx={mergeSx(
          { p: 0.75, borderRadius: "inherit" },
          slotProps?.nextBtn?.sx,
        )}
        svgIcon={slotProps?.nextBtn?.svgIcon}
        svgSize={slotProps?.prevBtn?.svgSize ?? 16}
      />
    </Stack>
  );
}
