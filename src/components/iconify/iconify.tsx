"use client";

import type { BoxProps } from "@mui/material/Box";
import type { Theme, SxProps } from "@mui/material/styles";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import { Icon } from "@iconify/react";
import NoSsr from "@mui/material/NoSsr";

import { iconifyClasses } from "./classes";

// ----------------------------------------------------------------------

interface IconifyProps extends Omit<BoxProps, "sx" | "component"> {
  className?: string;
  width?: number | string;
  sx?: SxProps<Theme>;
  icon: string;
}

export const Iconify = forwardRef<HTMLDivElement, IconifyProps>(
  ({ className, width = 20, sx, ...other }, ref) => {
    const baseStyles = {
      width,
      height: width,
      flexShrink: 0,
      display: "inline-flex",
    };

    const renderFallback = (
      <Box
        component="span"
        className={iconifyClasses.root.concat(className ? ` ${className}` : "")}
        sx={{ ...baseStyles, ...sx }}
      />
    );

    return (
      <NoSsr fallback={renderFallback}>
        <Box
          ref={ref}
          component={Icon}
          className={iconifyClasses.root.concat(
            className ? ` ${className}` : "",
          )}
          sx={{ ...baseStyles, ...sx }}
          {...other}
        />
      </NoSsr>
    );
  },
);
