import { varAlpha } from "src/theme/styles";
import { useTheme } from "@mui/material/styles";
import { Children, forwardRef, isValidElement } from "react";

import { carouselClasses } from "../classes";
import { CarouselSlide } from "./carousel-slide";
import { StyledRoot, StyledContainer } from "../carousel";

import type { CarouselAxis } from "../carousel";
import type { CarouselThumbsProps } from "./types";

// Re-exported so importers keep resolving these from this module.
export { CarouselThumb } from "./carousel-thumb";

// ----------------------------------------------------------------------

export const CarouselThumbs = forwardRef<HTMLDivElement, CarouselThumbsProps>(
  ({ children, slotProps, options, sx, ...other }, ref) => {
    const axis = options?.axis ?? "x";

    const slideSpacing = options?.slideSpacing ?? "12px";

    const maskStyles = useMaskStyle(axis);

    const renderChildren = Children.map(children, (child) => {
      if (isValidElement(child)) {
        const reactChild = child;

        return (
          <CarouselSlide
            key={reactChild.key}
            options={{ ...options, slideSpacing }}
            sx={slotProps?.slide}
          >
            {child}
          </CarouselSlide>
        );
      }
      return null;
    });

    return (
      <StyledRoot
        ref={ref}
        axis={axis}
        className={carouselClasses.thumbs}
        sx={{
          flexShrink: 0,
          ...(axis === "x" && { p: 0.5, maxWidth: 1 }),
          ...(axis === "y" && { p: 0.5, maxHeight: 1 }),
          ...(!slotProps?.disableMask && maskStyles),
          ...sx,
        }}
        {...other}
      >
        <StyledContainer
          as="ul"
          axis={axis}
          slideSpacing={slideSpacing}
          className={carouselClasses.thumbContainer}
          sx={{
            ...slotProps?.container,
          }}
        >
          {renderChildren}
        </StyledContainer>
      </StyledRoot>
    );
  },
);

// ----------------------------------------------------------------------

function useMaskStyle(axis: CarouselAxis) {
  const theme = useTheme();
  const backgroundVars = theme.vars?.palette.background as
    | Record<string, string>
    | undefined;

  const baseStyles = {
    zIndex: 9,
    content: '""',
    position: "absolute",
  };

  const backgroundPaper =
    theme.vars?.palette.background.paper ?? theme.palette.background.paper;
  const backgroundPaperChannel =
    backgroundVars?.paperChannel ?? theme.palette.background.paper;
  const bgcolor = `${backgroundPaper} 20%, ${varAlpha(backgroundPaperChannel, 0)} 100%)`;

  if (axis === "y") {
    return {
      "&::before, &::after": {
        ...baseStyles,
        left: 0,
        height: 40,
        width: "100%",
      },
      "&::before": {
        top: -8,
        background: `linear-gradient(to bottom, ${bgcolor}`,
      },
      "&::after": {
        bottom: -8,
        background: `linear-gradient(to top, ${bgcolor}`,
      },
    };
  }

  return {
    "&::before, &::after": {
      ...baseStyles,
      top: 0,
      width: 40,
      height: "100%",
    },
    "&::before": {
      left: -8,
      background: `linear-gradient(to right, ${bgcolor}`,
    },
    "&::after": {
      right: -8,
      background: `linear-gradient(to left, ${bgcolor}`,
    },
  };
}
