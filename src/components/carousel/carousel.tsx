import type { ReactNode } from "react";
import type { BoxProps } from "@mui/material/Box";
import type { Theme, SxProps } from "@mui/material/styles";

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Children, isValidElement } from "react";

import { carouselClasses } from "./classes";
import { CarouselSlide } from "./components/carousel-slide";

export type CarouselAxis = "x" | "y";

interface StyledRootProps {
  axis: CarouselAxis;
}

interface StyledContainerProps extends StyledRootProps {
  slideSpacing: string;
}

export interface CarouselOptions {
  axis?: CarouselAxis;
  direction?: "ltr" | "rtl";
  slideSpacing?: string;
  parallax?: boolean;
  slidesToShow?: number | string | Record<string, number | string>;
}

export interface CarouselState {
  mainRef: BoxProps["ref"];
  options?: CarouselOptions;
  pluginNames?: string[];
}

export interface CarouselSlotProps {
  slide?: SxProps<Theme>;
  container?: SxProps<Theme>;
  disableMask?: boolean;
  prevBtn?: {
    svgIcon?: ReactNode;
    svgSize?: number;
    sx?: SxProps<Theme>;
  };
  nextBtn?: {
    svgIcon?: ReactNode;
    svgSize?: number;
    sx?: SxProps<Theme>;
  };
  dot?: {
    size?: number;
    sx?: SxProps<Theme>;
    selected?: SxProps<Theme>;
  };
}

interface CarouselProps {
  carousel: CarouselState;
  children?: ReactNode;
  sx?: SxProps<Theme>;
  slotProps?: CarouselSlotProps;
}

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

export function Carousel({ carousel, children, sx, slotProps }: CarouselProps) {
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
}
