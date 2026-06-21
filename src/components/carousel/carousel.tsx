import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Children, forwardRef, isValidElement } from "react";

import { carouselClasses } from "./classes";
import { CarouselSlide } from "./components/carousel-slide";

import type {
  CarouselProps,
  StyledRootProps,
  StyledContainerProps,
} from "./types";

export type {
  CarouselAxis,
  CarouselState,
  CarouselProps,
  StyledRootProps,
  CarouselOptions,
  CarouselSlotProps,
  StyledContainerProps,
} from "./types";

export const StyledRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== "axis",
})<StyledRootProps>(({ axis }) => ({
  margin: "auto",
  maxWidth: "100%",
  overflow: "hidden",
  position: "relative",
  ...(axis === "y" && {
    height: "100%",
  }),
}));

export const StyledContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "axis" && prop !== "slideSpacing",
})<StyledContainerProps>(({ axis, slideSpacing }) => ({
  display: "flex",
  backfaceVisibility: "hidden",
  ...(axis === "x" && {
    touchAction: "pan-y pinch-zoom",
    marginLeft: `calc(${slideSpacing} * -1)`,
  }),
  ...(axis === "y" && {
    height: "100%",
    flexDirection: "column",
    touchAction: "pan-x pinch-zoom",
    marginTop: `calc(${slideSpacing} * -1)`,
  }),
}));

// ----------------------------------------------------------------------

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  ({ carousel, children, sx, slotProps, ...other }, _ref) => {
    const { mainRef, options } = carousel;

    const axis = options?.axis ?? "x";

    const slideSpacing = options?.slideSpacing ?? "0px";

    const direction = options?.direction ?? "ltr";

    const renderChildren = Children.map(children, (child) => {
      if (isValidElement(child)) {
        const reactChild = child;

        return (
          <CarouselSlide
            key={reactChild.key}
            options={carousel.options}
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
        sx={sx}
        axis={axis}
        ref={mainRef}
        dir={direction}
        className={carouselClasses.root}
        {...other}
      >
        <StyledContainer
          as="ul"
          axis={axis}
          slideSpacing={slideSpacing}
          className={carouselClasses.container}
          sx={{
            ...(carousel.pluginNames?.includes("autoHeight") && {
              alignItems: "flex-start",
              transition: (theme) =>
                theme.transitions.create(["height"], {
                  easing: theme.transitions.easing.easeInOut,
                  duration: theme.transitions.duration.shorter,
                }),
            }),
            ...slotProps?.container,
          }}
        >
          {renderChildren}
        </StyledContainer>
      </StyledRoot>
    );
  },
);

Carousel.displayName = "Carousel";
