"use client";

import { useId, forwardRef } from "react";

import Box from "@mui/material/Box";
import NoSsr from "@mui/material/NoSsr";
import { useTheme } from "@mui/material/styles";

import { RouterLink } from "src/routes/components";

import { logoClasses } from "./classes";

// ----------------------------------------------------------------------

export const Logo = forwardRef(
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

    const gradientId = useId();

    const PRIMARY_LIGHT = theme.vars.palette.primary.light;

    const PRIMARY_MAIN = theme.vars.palette.primary.main;

    const PRIMARY_DARK = theme.vars.palette.primary.dark;

    /*
     * OR using local (public folder)
     * const logo = ( <Box alt="logo" component="img" src={`${CONFIG.site.basePath}/logo/logo-single.svg`} width={width} height={height} /> );
     */

    const logo = (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 256 274">
        <path
          fill={PRIMARY_MAIN}
          fillRule="evenodd"
          d="M214.4 194.5l-22.8-15-19 31.7-22.1-6.4-19.5 29.7 1 9.3 105.8-19.5-6.1-66-17.3 36.2zM115.7 166l17-2.3c2.7 1.2 4.6 1.7 8 2.5a25 25 0 0019.8-1.8c2-1 6.3-5 8-7.1l69.6-12.7 7 86-119 21.4-10.4-86zm129.2-31l-6.9 1.4L224.8 0 .1 26l27.7 225 26.2-4c-2.1-3-5.4-6.6-11-11.2-7.7-6.5-5-17.4-.4-24.3 6-11.7 37.2-26.5 35.4-45.2-.6-6.7-1.7-15.6-8-21.6-.2 2.5.2 5 .2 5s-2.6-3.4-3.9-7.9c-1.2-1.7-2.2-2.2-3.6-4.5-1 2.6-.8 5.7-.8 5.7s-2.2-5-2.5-9.2a14.7 14.7 0 00-1.6 5.5s-2.7-8-2-12.1c-1.3-3.7-5-11-4-27.7 6.9 4.8 22 3.7 27.8-5 2-2.9 3.3-10.7-1-26.2-2.7-9.9-9.5-24.6-12.1-30.2l-.3.2a428 428 0 015.3 18.5C75 70.8 76 75.6 74.3 82c-1.3 5.6-4.5 9.2-12.6 13.3-8.1 4-18.9-5.9-19.6-6.4a43.3 43.3 0 01-14.6-21.5c-.7-5.5 3.1-8.7 5-13.2a50 50 0 00-5.8 2.2s3.7-3.8 8.2-7c2-1.3 3-2.1 5-3.8h-5.2s4.8-2.5 9.8-4.4c-3.7-.2-7.2 0-7.2 0s10.7-4.8 19.2-8.3c5.8-2.4 11.5-1.7 14.7 2.9 4.1 6 8.5 9.3 17.9 11.3 5.7-2.5 7.4-3.8 14.6-5.8 6.3-7 11.3-7.8 11.3-7.8s-2.5 2.2-3.1 5.8c3.6-2.8 7.5-5.2 7.5-5.2s-1.5 1.9-3 4.9l.4.5a79 79 0 019.1-4.5l-3 4c3.1 0 9.5.2 12 .5 14.7.3 17.7-15.7 23.3-17.7 7-2.5 10.2-4 22.2 7.8 10.3 10 18.4 28.2 14.4 32.3-3.4 3.3-10-1.3-17.3-10.5a39.5 39.5 0 01-8.2-17.8c-1.1-6.1-5.6-9.7-5.6-9.7s2.6 5.8 2.6 11c0 2.8.3 13.2 4.8 19.1-.4.9-.6 4.3-1.1 5-5.2-6.4-16.5-11-18.3-12.2 6.2 5 20.4 16.7 26 27.9 5.1 10.6 2 20.3 4.7 22.8.7.7 11.1 13.6 13.1 20.2 3.5 11.3.2 23.2-4.4 30.6l-12.7 2c-1.9-.5-3.1-.8-4.8-1.8a32 32 0 002.8-6.5l-.7-1.3a54.4 54.4 0 01-16.2 14.2 27.2 27.2 0 01-21 1.8 117.4 117.4 0 01-33.4-17.9s0 2.2.6 2.7c3.8 4.4 12.7 12.3 21.3 17.8l-18.3 2 8.7 67.4c-3.9.6-4.5.9-8.7 1.5a45.1 45.1 0 00-18.5-26.6A35 35 0 0065 200l-.5.6c6.2-.6 13.6.3 21.2 5.1 7.5 4.7 13.5 17 15.7 24.2 2.9 9.4 4.8 19.4-2.8 30-5.4 7.6-21.3 11.8-34 2.8 3.3 5.5 8 10 14.2 10.8 9.2 1.3 18-.3 24-6.5 5.2-5.3 7.9-16.4 7.2-28l8.1-1.2 3 20.9 135-16.3L245 135.1zm-82-56.8c-.5.9-1 1.4-.2 4.2v.2l.2.4.4.8c1.6 3.3 3.4 6.4 6.3 8 .8-.2 1.5-.3 2.4-.3 2.7-.1 4.5.3 5.6.9v-2.6c-.2-4.1.8-11.2-7.1-14.9-3-1.4-7.3-1-8.7.8l.7.2c2.1.7.7 1.4.3 2.3zm22.3 38.7a45.6 45.6 0 00-24.6 4.3c-2.8 2.2-1.5 6 .6 7.5 5.8 4.4 11 7.3 16.3 6.6 3.3-.4 6.2-5.7 8.3-10.4 1.4-3.3 1.4-6.8-.7-8zm-58-33.5c1.9-1.8-9.2-4.1-17.7 1.7-6.3 4.3-6.5 13.6-.5 18.8l1.6 1.2a51.7 51.7 0 0115.9-4.7c1.3-1.4 2.8-4 2.4-8.5-.5-6.2-5.2-5.2-1.7-8.5z"
          clipRule="evenodd"
        />
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
