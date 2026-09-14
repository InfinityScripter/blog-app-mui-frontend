"use client";

import Box from "@mui/material/Box";
import GlobalStyles from "@mui/material/GlobalStyles";

import { layoutClasses } from "../classes";
import { LAYOUT, layoutCssPx } from "../config-layout";

import type { LayoutSectionProps } from "./types";

// ----------------------------------------------------------------------

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
          "--layout-nav-mobile-width": layoutCssPx(LAYOUT.navMobileWidth),
          "--layout-header-blur": layoutCssPx(LAYOUT.headerBlur),
          "--layout-header-zIndex": 1100,
          "--layout-header-mobile-height": layoutCssPx(
            LAYOUT.headerMobileHeight,
          ),
          "--layout-header-desktop-height": layoutCssPx(
            LAYOUT.headerDesktopHeight,
          ),
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
              className={layoutClasses.hasSidebar}
              sx={{
                display: "flex",
                flex: "1 1 auto",
                flexDirection: "column",
              }}
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
