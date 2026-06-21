import type { StackProps } from "@mui/material/Stack";
import type { Theme, SxProps } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { varAlpha, stylesMode } from "src/theme/styles";

import { mergeSx } from "./utils";
import { ArrowButton } from "./arrow-button";
import { carouselClasses } from "../classes";

import type { CarouselOptions, CarouselSlotProps } from "../carousel";

// Re-exported so importers keep resolving these from this module.
export { ArrowButton } from "./arrow-button";
export type { ArrowButtonProps, ArrowButtonSlotProps } from "./arrow-button";

// ----------------------------------------------------------------------

export interface CarouselArrowButtonsProps
  extends Omit<StackProps, "slotProps"> {
  options?: CarouselOptions;
  slotProps?: Pick<CarouselSlotProps, "prevBtn" | "nextBtn">;
  onClickPrev?: () => void;
  onClickNext?: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
  sx?: SxProps<Theme>;
}

export interface CarouselArrowNumberButtonsProps
  extends CarouselArrowButtonsProps {
  totalSlides?: number;
  selectedIndex?: number;
}

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
