import Stack from "@mui/material/Stack";

import { ArrowButton } from "./arrow-button";
import { carouselClasses } from "../classes";

import type { CarouselArrowButtonsProps } from "./types";

// ----------------------------------------------------------------------

export function CarouselArrowBasicButtons({
  options,
  slotProps,
  onClickPrev,
  onClickNext,
  disablePrev,
  disableNext,
  sx,
  ...other
}: CarouselArrowButtonsProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      display="inline-flex"
      className={carouselClasses.arrows}
      sx={{
        gap: 0.5,
        zIndex: 9,
        color: "action.active",
        ...sx,
      }}
      {...other}
    >
      <ArrowButton
        variant="prev"
        options={options}
        disabled={disablePrev}
        onClick={onClickPrev}
        svgIcon={slotProps?.prevBtn?.svgIcon}
        svgSize={slotProps?.prevBtn?.svgSize}
        sx={slotProps?.prevBtn?.sx}
      />

      <ArrowButton
        variant="next"
        options={options}
        disabled={disableNext}
        onClick={onClickNext}
        svgIcon={slotProps?.nextBtn?.svgIcon}
        svgSize={slotProps?.prevBtn?.svgSize}
        sx={slotProps?.prevBtn?.sx}
      />
    </Stack>
  );
}
