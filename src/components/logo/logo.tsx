"use client";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import NoSsr from "@mui/material/NoSsr";
import { useTheme } from "@mui/material/styles";
import { RouterLink } from "src/routes/components";

import { logoClasses } from "./classes";

import type { LogoProps } from "./types";

// ----------------------------------------------------------------------
// aifirst — Editorial Ink logo.
//   variant="full"     → mark + "aifirst." wordmark (default; header/footer)
//   variant="mark"     → tile only (favicon-like spots)
//   variant="wordmark" → "aifirst." only
// Colors come from theme vars, so light/dark schemes track automatically.

export const Logo = forwardRef<HTMLAnchorElement, LogoProps>(
  (
    {
      width,
      height = 40,
      disableLink = false,
      className,
      href = "/",
      variant = "full",
      sx,
      ...other
    },
    ref,
  ) => {
    const theme = useTheme();

    const TILE = `var(--logo-foreground, ${theme.vars.palette.text.primary})`;
    const CARET = `var(--logo-background, ${theme.vars.palette.background.paper})`;
    const CURSOR = theme.vars.palette.primary.main; // signal vermilion

    const mark = (
      <Box
        component="svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        fill="none"
        sx={{ width: height, height, flexShrink: 0, display: "block" }}
      >
        <rect width="512" height="512" rx="116" fill={TILE} />
        <polyline
          points="168,166 282,256 168,346"
          fill="none"
          stroke={CARET}
          strokeWidth="46"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="300" y="166" width="52" height="180" rx="14" fill={CURSOR} />
      </Box>
    );

    const word = (
      <Box
        component="span"
        sx={{
          fontFamily: theme.typography.fontSecondaryFamily, // Unbounded
          fontWeight: 600,
          fontSize:
            typeof height === "number"
              ? height * 0.72
              : `calc(${height} * 0.72)`,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: TILE,
          userSelect: "none",
        }}
      >
        aifirst
        <Box component="span" sx={{ color: "primary.main" }}>
          .
        </Box>
      </Box>
    );

    const content =
      variant === "mark" ? (
        mark
      ) : variant === "wordmark" ? (
        word
      ) : (
        <>
          {mark}
          {word}
        </>
      );

    return (
      <NoSsr
        fallback={
          <Box
            width={width ?? height}
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
          className={logoClasses.root.concat(className ? ` ${className}` : "")}
          aria-label="aifirst."
          sx={{
            gap:
              typeof height === "number"
                ? `${height * 0.3}px`
                : `calc(${height} * 0.3)`,
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            verticalAlign: "middle",
            textDecoration: "none",
            ...(disableLink && { pointerEvents: "none" }),
            ...sx,
          }}
          {...other}
        >
          {content}
        </Box>
      </NoSsr>
    );
  },
);
