"use client";

import Alert from "@mui/material/Alert";
import { CONFIG } from "src/config-global";
import { useBoolean } from "src/hooks/use-boolean";

import { Main } from "./main";
import { Section } from "./section";
import { Content } from "./content";
import { HeaderBase } from "../core/header-base";
import { LayoutSection } from "../core/layout-section";

import type { AuthSplitLayoutProps } from "./types";

// ----------------------------------------------------------------------

export function AuthSplitLayout({
  sx,
  section,
  children,
}: AuthSplitLayoutProps) {
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
            topArea: (
              <Alert severity="info" sx={{ display: "none", borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
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
