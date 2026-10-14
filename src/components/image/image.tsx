import type { BoxProps } from "@mui/material/Box";
import type { Theme, SxProps } from "@mui/material/styles";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import { CONFIG } from "src/config-global";
import { styled } from "@mui/material/styles";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { imageClasses } from "./classes";

import type { ImageProps } from "./types";

// ----------------------------------------------------------------------

const ImageWrapper = styled(Box)<BoxProps>({
  overflow: "hidden",
  position: "relative",
  verticalAlign: "bottom",
  display: "inline-block",
  [`& .${imageClasses.wrapper}`]: {
    width: "100%",
    height: "100%",
    verticalAlign: "bottom",
    backgroundSize: "cover !important",
  },
});

const Overlay = styled("span")({
  top: 0,
  left: 0,
  zIndex: 1,
  width: "100%",
  height: "100%",
  position: "absolute",
});

// ----------------------------------------------------------------------

export const Image = forwardRef<HTMLSpanElement, ImageProps>(
  (
    {
      ratio,
      priority = false,
      disabledEffect = false,
      //
      alt,
      src,
      delayTime,
      threshold,
      beforeLoad,
      delayMethod,
      placeholder,
      wrapperProps,
      scrollPosition,
      effect = "blur",
      visibleByDefault,
      wrapperClassName,
      useIntersectionObserver,
      //
      slotProps,
      sx,
      ...other
    },
    ref,
  ) => {
    const imageSx: SxProps<Theme> = {
      width: 1,
      height: 1,
      objectFit: "cover",
      verticalAlign: "bottom",
      aspectRatio: ratio,
    };

    const content = priority ? (
      <Box
        component="img"
        alt={alt}
        src={src}
        loading="eager"
        fetchPriority="high"
        sx={imageSx}
      />
    ) : (
      <Box
        component={LazyLoadImage}
        alt={alt}
        src={src}
        delayTime={delayTime}
        threshold={threshold}
        beforeLoad={beforeLoad}
        delayMethod={delayMethod}
        placeholder={placeholder}
        wrapperProps={wrapperProps}
        scrollPosition={scrollPosition}
        visibleByDefault={visibleByDefault}
        effect={visibleByDefault || disabledEffect ? undefined : effect}
        useIntersectionObserver={useIntersectionObserver}
        wrapperClassName={wrapperClassName || imageClasses.wrapper}
        placeholderSrc={
          visibleByDefault || disabledEffect
            ? `${CONFIG.site.basePath}/assets/transparent.png`
            : `${CONFIG.site.basePath}/assets/placeholder.svg`
        }
        sx={imageSx}
      />
    );

    return (
      <ImageWrapper
        ref={ref}
        component="span"
        className={imageClasses.root}
        sx={{ ...(!!ratio && { width: 1 }), ...sx }}
        {...other}
      >
        {slotProps?.overlay && (
          <Overlay className={imageClasses.overlay} sx={slotProps?.overlay} />
        )}

        {content}
      </ImageWrapper>
    );
  },
);
