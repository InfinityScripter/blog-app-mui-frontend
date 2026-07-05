"use client";

import Alert from "@mui/material/Alert";
import { usePathname } from "src/routes/hooks";
import { useTheme } from "@mui/material/styles";
import { useBoolean } from "src/hooks/use-boolean";
import { LlmBackdrop } from "src/components/llm-backdrop";

import { Main } from "./main";
import { Footer } from "./footer";
import { NavMobile } from "./nav/mobile";
import { NavDesktop } from "./nav/desktop";
import { HomeFooter } from "./home-footer";
import { HeaderBase } from "../core/header-base";
import { useNavData } from "./hooks/use-nav-data";
// ----------------------------------------------------------------------
import { LayoutSection } from "../core/layout-section";
import { PostSearchbar } from "../components/post-searchbar";

import type { MainLayoutProps } from "./types";

export function MainLayout({ sx, data, children }: MainLayoutProps) {
  const theme = useTheme();

  const pathname = usePathname();

  const mobileNavOpen = useBoolean();

  const homePage = pathname === "/";

  // Dim the logo backdrop behind long article bodies; fuller on landing/lists.
  const readingPage = pathname.startsWith("/post/");

  const layoutQuery = "md";

  const defaultNav = useNavData();
  const navData = data?.nav ?? defaultNav;

  return (
    <>
      <LlmBackdrop variant={readingPage ? "reading" : "showcase"} />

      <NavMobile
        data={navData}
        open={mobileNavOpen.value}
        onClose={mobileNavOpen.onFalse}
      />

      <LayoutSection
        /** **************************************
         * Header
         *************************************** */
        headerSection={
          <HeaderBase
            layoutQuery={layoutQuery}
            onOpenNav={mobileNavOpen.onTrue}
            slotsDisplay={{
              account: false,
              helpLink: false,
              searchbar: false,
              notifications: false,
            }}
            slots={{
              topArea: (
                <Alert
                  severity="info"
                  sx={{ display: "none", borderRadius: 0 }}
                >
                  This is an info Alert.
                </Alert>
              ),
              rightAreaStart: (
                <>
                  <PostSearchbar />
                  <NavDesktop
                    data={navData}
                    sx={{
                      display: "none",
                      [theme.breakpoints.up(layoutQuery)]: {
                        ml: 2.5,
                        mr: 2.5,
                        display: "flex",
                      },
                    }}
                  />
                </>
              ),
            }}
          />
        }
        /** **************************************
         * Footer
         *************************************** */
        footerSection={
          homePage ? <HomeFooter /> : <Footer layoutQuery={layoutQuery} />
        }
        /** **************************************
         * Style
         *************************************** */
        sx={sx}
      >
        <Main>{children}</Main>
      </LayoutSection>
    </>
  );
}
