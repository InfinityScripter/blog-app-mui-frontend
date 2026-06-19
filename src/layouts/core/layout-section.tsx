"use client";

import type { ReactNode } from "react";
import type { Theme, SxProps } from "@mui/material/styles";

import Box from "@mui/material/Box";
import GlobalStyles from "@mui/material/GlobalStyles";

import { layoutClasses } from "../classes";

// ----------------------------------------------------------------------

/**
 * CSS custom-property maps fed into `GlobalStyles`. Values are CSS strings or
 * numbers, but entries may nest one level (e.g. a `[data-mui-color-scheme]`
 * selector block) as produced by the layouts' `navColorVars`.
 */
export type CssVars = Record<
  string,
  string | number | undefined | Record<string, string | number | undefined>
>;

export interface LayoutSectionProps {
  sx?: SxProps<Theme>;
  cssVars?: CssVars;
  children?: ReactNode;
  footerSection?: ReactNode;
  headerSection?: ReactNode;
  sidebarSection?: ReactNode;
}

export function LayoutSection({
  sx,
  cssVars,
  children,
  footerSection,
  headerSection,
  sidebarSection,
}: LayoutSectionProps) {
  const inputGlobalStyles = (
    <GlobalStyles
      styles={{
        body: {
          "--layout-nav-zIndex": 1101,
          "--layout-nav-mobile-width": "320px",
          "--layout-header-blur": "8px",
          "--layout-header-zIndex": 1100,
          "--layout-header-mobile-height": "64px",
          "--layout-header-desktop-height": "72px",
          ...cssVars,
        },
      }}
    />
  );

  return (
    <>
      {inputGlobalStyles}

      <Box id="root__layout" className={layoutClasses.root} sx={sx}>
        {sidebarSection ? (
          <>
            {sidebarSection}
            <Box
              display="flex"
              flex="1 1 auto"
              flexDirection="column"
              className={layoutClasses.hasSidebar}
            >
              {headerSection}
              {children}
              {footerSection}
            </Box>
          </>
        ) : (
          <>
            {headerSection}
            {children}
            {footerSection}
          </>
        )}
      </Box>
    </>
  );
}
