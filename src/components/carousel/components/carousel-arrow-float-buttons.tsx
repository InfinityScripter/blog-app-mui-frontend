import { stylesMode } from "src/theme/styles";

import { mergeSx } from "./utils";
import { ArrowButton } from "./arrow-button";

import type { CarouselArrowButtonsProps } from "./types";

// ----------------------------------------------------------------------

export function CarouselArrowFloatButtons({
  options,
  slotProps,
  onClickPrev,
  onClickNext,
  disablePrev,
  disableNext,
}: CarouselArrowButtonsProps) {
  const baseStyles = {
    zIndex: 9,
    top: "50%",
    borderRadius: 1.5,
    position: "absolute",
    color: "common.white",
    bgcolor: "text.primary",
    transform: "translateY(-50%)",
    "&:hover": { opacity: 0.8 },
    [stylesMode.dark]: { color: "grey.800" },
  };

  return (
    <>
      <ArrowButton
        variant="prev"
        options={options}
        disabled={disablePrev}
        onClick={onClickPrev}
        svgIcon={slotProps?.prevBtn?.svgIcon}
        svgSize={slotProps?.prevBtn?.svgSize}
        sx={mergeSx({ left: -16, ...baseStyles }, slotProps?.prevBtn?.sx)}
      />

      <ArrowButton
        variant="next"
        options={options}
        disabled={disableNext}
        onClick={onClickNext}
        svgIcon={slotProps?.nextBtn?.svgIcon}
        svgSize={slotProps?.nextBtn?.svgSize}
        sx={mergeSx({ right: -16, ...baseStyles }, slotProps?.nextBtn?.sx)}
      />
    </>
  );
}
