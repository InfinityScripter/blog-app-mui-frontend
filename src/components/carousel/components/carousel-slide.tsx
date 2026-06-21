import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import { getSize } from "./utils";
import { carouselClasses } from "../classes";

import type { StyledRootProps, CarouselSlideProps } from "./types";

// ----------------------------------------------------------------------

const StyledRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== "axis" && prop !== "slideSpacing",
})<StyledRootProps>(({ axis, slideSpacing }) => ({
  display: "block",
  position: "relative",
  ...(axis === "x" && {
    minWidth: 0,
    paddingLeft: slideSpacing,
  }),
  ...(axis === "y" && {
    minHeight: 0,
    paddingTop: slideSpacing,
  }),
}));

const StyledContent = styled(Box)(() => ({
  overflow: "hidden",
  position: "relative",
  borderRadius: "inherit",
}));

// ----------------------------------------------------------------------

export function CarouselSlide({
  sx,
  options,
  children,
  ...other
}: CarouselSlideProps) {
  const slideSize = getSize(options?.slidesToShow);

  return (
    <StyledRoot
      as="li"
      axis={options?.axis ?? "x"}
      slideSpacing={options?.slideSpacing}
      className={carouselClasses.slide}
      sx={{
        flex: slideSize,
        ...sx,
      }}
      {...other}
    >
      {options?.parallax ? (
        <StyledContent className={carouselClasses.slideContent}>
          <div className="slide__parallax__layer">{children}</div>
        </StyledContent>
      ) : (
        children
      )}
    </StyledRoot>
  );
}
