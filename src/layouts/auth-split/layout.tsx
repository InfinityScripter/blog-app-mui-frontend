"use client";

import { CONFIG } from "src/config-global";
import { useTheme } from "@mui/material/styles";
import { useBoolean } from "src/hooks/use-boolean";

import { Main } from "./main";
import { Section } from "./section";
import { Content } from "./content";
import { HeaderBase } from "../core/header-base";
import { LayoutSection } from "../core/layout-section";
import { BackToSiteButton } from "../components/back-to-site-button";

import type { AuthSplitLayoutProps } from "./types";

// ----------------------------------------------------------------------

export function AuthSplitLayout({
  sx,
  section,
  children,
}: AuthSplitLayoutProps) {
  const theme = useTheme();

  const mobileNavOpen = useBoolean();

  const layoutQuery = "md";

  return (
    <LayoutSection
      headerSection={
        /** **************************************
         * Header
         *************************************** */
        <HeaderBase
          disableElevation
          layoutQuery={layoutQuery}
          onOpenNav={mobileNavOpen.onTrue}
          slotsDisplay={{
            signIn: false,
            account: false,
            searchbar: false,
            menuButton: false,
            notifications: false,
          }}
          slots={{
            leftAreaEnd: <BackToSiteButton sx={{ ml: 2 }} />,
          }}
          slotProps={{ container: { maxWidth: false } }}
          sx={{ position: { [layoutQuery]: "fixed" } }}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      sx={sx}
      cssVars={{
        "--layout-auth-content-width": "420px",
        // The ink panel behind the header's left area only exists from
        // `layoutQuery` up. Unscoped, these inverted colours also applied on
        // mobile, where they painted the wordmark white on a white page.
        [theme.breakpoints.up(layoutQuery)]: {
          "--logo-foreground": theme.vars.palette.common.white,
          "--logo-background": theme.vars.palette.grey[900],
        },
      }}
    >
      <Main layoutQuery={layoutQuery}>
        <Section
          title={section?.title}
          layoutQuery={layoutQuery}
          method={CONFIG.auth.method}
          subtitle={section?.subtitle}
        />
        <Content layoutQuery={layoutQuery}>{children}</Content>
      </Main>
    </LayoutSection>
  );
}
