"use client";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import NoSsr from "@mui/material/NoSsr";
import { useTheme } from "@mui/material/styles";
import { RouterLink } from "src/routes/components";

import { logoClasses } from "./classes";

import type { LogoProps } from "./types";

// ----------------------------------------------------------------------

export const Logo = forwardRef<HTMLAnchorElement, LogoProps>(
  (
    {
      width = 40,
      height = 40,
      disableLink = false,
      className,
      href = "/",
      sx,
      ...other
    },
    ref,
  ) => {
    const theme = useTheme();

    const PRIMARY_MAIN = theme.vars.palette.primary.main;
    const PRIMARY_DARK = theme.vars.palette.primary.dark;
    const PRIMARY_LIGHT = theme.vars.palette.primary.light;

    const gradientId = "logo-gradient";

    /*
     * Personal-brand mark: a rounded tile with a geometric "T" monogram
     * (Talalaev). Colors come from the theme primary palette, so it tracks
     * the active color scheme / light-dark mode.
     */
    const logo = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 512 512"
        width="100%"
        height="100%"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2="512"
            y2="512"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={PRIMARY_LIGHT} />
            <stop offset="0.55" stopColor={PRIMARY_MAIN} />
            <stop offset="1" stopColor={PRIMARY_DARK} />
          </linearGradient>
        </defs>

        <rect width="512" height="512" rx="120" fill={`url(#${gradientId})`} />
        <path fill="#FFFFFF" d="M140 150h232v56h-88v212h-56V206h-88z" />
      </svg>
    );

    return (
      <NoSsr
        fallback={
          <Box
            width={width}
            height={height}
            className={logoClasses.root.concat(
              className ? ` ${className}` : "",
            )}
            sx={{
              flexShrink: 0,
              display: "inline-flex",
              verticalAlign: "middle",
              ...sx,
            }}
          />
        }
      >
        <Box
          ref={ref}
          component={RouterLink}
          href={href}
          width={width}
          height={height}
          className={logoClasses.root.concat(className ? ` ${className}` : "")}
          aria-label="logo"
          sx={{
            flexShrink: 0,
            display: "inline-flex",
            verticalAlign: "middle",
            ...(disableLink && { pointerEvents: "none" }),
            ...sx,
          }}
          {...other}
        >
          {logo}
        </Box>
      </NoSsr>
    );
  },
);
