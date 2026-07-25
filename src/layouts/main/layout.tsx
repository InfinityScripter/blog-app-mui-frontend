"use client";

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

  // The 8 full-text nav items + logo + search + right-side icons only fit on
  // one clean row from ~1200px up; below that we collapse to the mobile
  // hamburger (which already carries every nav link) instead of wrapping.
  const layoutQuery = "lg";

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
              // Three zones: brand + navigation left, utilities right. Keeping
              // the nav next to the logo stops search/nav/icons piling into one
              // right-hand blob with the logo stranded on the far side.
              leftAreaEnd: (
                <NavDesktop
                  data={navData}
                  sx={{
                    display: "none",
                    [theme.breakpoints.up(layoutQuery)]: {
                      ml: 3,
                      display: "flex",
                    },
                    // A hard floor under the zone spacer, but only where the
                    // row has slack — forcing it at `lg` pushed the utilities
                    // past the viewport instead of just closing the gap.
                    [theme.breakpoints.up("xl")]: { mr: 4 },
                  }}
                />
              ),
              rightAreaStart: <PostSearchbar />,
            }}
            // The header is a utility bar, not part of the reading column: at
            // `lg` the RU nav + logo + utilities need ~1163px of a 1152px
            // content box, so it has to be allowed past the page container.
            slotProps={{ container: { maxWidth: "xl" } }}
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
