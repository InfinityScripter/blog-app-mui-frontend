import type { BoxProps } from "@mui/material/Box";
import type { Theme, SxProps } from "@mui/material/styles";

import Box from "@mui/material/Box";
import NoSsr from "@mui/material/NoSsr";
import { useTheme } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import { varAlpha, stylesMode } from "src/theme/styles";

import { carouselClasses } from "../classes";

import type { CarouselSlotProps } from "../carousel";

// ----------------------------------------------------------------------

interface CarouselDotButtonsProps extends Omit<BoxProps, "slotProps"> {
  sx?: SxProps<Theme>;
  gap?: number;
  slotProps?: Pick<CarouselSlotProps, "dot">;
  onClickDot: (index: number) => void;
  scrollSnaps: number[];
  selectedIndex: number;
  fallbackCount?: number;
  variant?: "circular" | "rounded" | "number";
  fallback?: boolean;
}

export function CarouselDotButtons({
  sx,
  gap,
  slotProps,
  onClickDot,
  scrollSnaps,
  selectedIndex,
  fallbackCount = 1,
  variant = "circular",
  fallback = false,
  ...other
}: CarouselDotButtonsProps) {
  const theme = useTheme();
  const greyVars = theme.vars?.palette.grey as
    | Record<string, string>
    | undefined;
  const grey500Channel =
    greyVars?.["500Channel"] ?? theme.palette.grey[500] ?? "145 158 171";

  const GAPS = {
    number: gap ?? 6,
    rounded: gap ?? 2,
    circular: gap ?? 2,
  };

  const SIZES = {
    circular: slotProps?.dot?.size ?? 18,
    number: slotProps?.dot?.size ?? 28,
  };

  const renderFallback = (
    <Box
      sx={{
        height: SIZES.circular,
        width: `calc(${fallbackCount * SIZES.circular + GAPS.circular * (fallbackCount - 1)}px )`,
        ...(variant === "number" && {
          height: SIZES.number,
          width: `calc(${fallbackCount * SIZES.number + GAPS.number * (fallbackCount - 1)}px )`,
        }),
      }}
    />
  );

  const dotStyles = {
    circular: (selected: boolean) => ({
      width: SIZES.circular,
      height: SIZES.circular,
      "&::before": {
        width: 8,
        height: 8,
        content: '""',
        opacity: 0.24,
        borderRadius: "50%",
        bgcolor: "currentColor",
        transition: theme.transitions.create(["opacity"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.short,
        }),
        ...(selected && { opacity: 1 }),
      },
    }),
    rounded: (selected: boolean) => ({
      width: SIZES.circular,
      height: SIZES.circular,
      "&::before": {
        width: 8,
        height: 8,
        content: '""',
        opacity: 0.24,
        borderRadius: "50%",
        bgcolor: "currentColor",
        transition: theme.transitions.create(["width", "opacity"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.short,
        }),
        ...(selected && {
          width: "calc(100% - 4px)",
          opacity: 1,
          borderRadius: 1,
        }),
      },
    }),
    number: (selected: boolean) => ({
      width: SIZES.number,
      height: SIZES.number,
      borderRadius: "50%",
      typography: "caption",
      color: "text.disabled",
      border: `solid 1px ${varAlpha(grey500Channel, 0.16)}`,
      ...(selected && {
        color: "common.white",
        bgcolor: "text.primary",
        fontWeight: "fontWeightSemiBold",
        [stylesMode.dark]: { color: "grey.800" },
      }),
    }),
  };

  return (
    <NoSsr fallback={fallback ? renderFallback : null}>
      <Box
        component="ul"
        className={carouselClasses.dots}
        sx={{
          zIndex: 9,
          display: "inline-flex",
          ...(variant === "circular" && { gap: `${GAPS.circular}px` }),
          ...(variant === "rounded" && { gap: `${GAPS.rounded}px` }),
          ...(variant === "number" && { gap: `${GAPS.number}px` }),
          ...sx,
        }}
        {...other}
      >
        {scrollSnaps.map((_, index) => {
          const selected = index === selectedIndex;

          return (
            <Box component="li" key={index} sx={{ display: "inline-flex" }}>
              <ButtonBase
                disableRipple
                aria-label={`dot-${index}`}
                className={carouselClasses.dot.concat(
                  selected ? ` ${carouselClasses.state.selected}` : "",
                )}
                onClick={() => onClickDot(index)}
                sx={{
                  ...(variant === "circular" && dotStyles.circular(selected)),
                  ...(variant === "rounded" && dotStyles.rounded(selected)),
                  ...(variant === "number" && dotStyles.number(selected)),
                  [`&.${carouselClasses.state.selected}`]: {
                    ...slotProps?.dot?.selected,
                  },
                  ...slotProps?.dot?.sx,
                }}
              >
                {variant === "number" && index + 1}
              </ButtonBase>
            </Box>
          );
        })}
      </Box>
    </NoSsr>
  );
}
