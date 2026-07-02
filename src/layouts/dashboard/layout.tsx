"use client";

import { _contacts } from "src/_mock";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import { useAuthContext } from "src/auth/hooks";
import { useBoolean } from "src/hooks/use-boolean";
import { iconButtonClasses } from "@mui/material/IconButton";
import { useSettingsContext } from "src/components/settings";

import { Main } from "./main";
import { _langs } from "./const";
import { NavMobile } from "./nav-mobile";
import { layoutClasses } from "../classes";
import { NavVertical } from "./nav-vertical";
import { NavHorizontal } from "./nav-horizontal";
import { _account } from "../config-nav-account";
// ----------------------------------------------------------------------
import { HeaderBase } from "../core/header-base";
import { getNavData } from "../config-nav-dashboard";
import { _workspaces } from "../config-nav-workspace";
import { LayoutSection } from "../core/layout-section";
import { useNavColorVars } from "./hooks/use-nav-color-vars";

import type { DashboardLayoutProps } from "./types";

export function DashboardLayout({ sx, children, data }: DashboardLayoutProps) {
  const theme = useTheme();

  const mobileNavOpen = useBoolean();

  const settings = useSettingsContext();

  const navColorVars = useNavColorVars(theme, settings);

  const layoutQuery = "lg";

  const { user } = useAuthContext();

  const navData = data?.nav ?? getNavData(user?.role);

  const isNavMini = settings.navLayout === "mini";

  const isNavHorizontal = settings.navLayout === "horizontal";

  const isNavVertical = isNavMini || settings.navLayout === "vertical";

  return (
    <>
      <NavMobile
        data={navData}
        open={mobileNavOpen.value}
        onClose={mobileNavOpen.onFalse}
        cssVars={navColorVars.section}
      />

      <LayoutSection
        /** **************************************
         * Header
         *************************************** */
        headerSection={
          <HeaderBase
            layoutQuery={layoutQuery}
            disableElevation={isNavVertical}
            onOpenNav={mobileNavOpen.onTrue}
            data={{
              nav: navData,
              langs: _langs,
              account: _account,
              contacts: _contacts,
              workspaces: _workspaces,
            }}
            slotsDisplay={{
              signIn: false,
              helpLink: false,
              notifications: true,
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
              bottomArea: isNavHorizontal ? (
                <NavHorizontal
                  data={navData}
                  layoutQuery={layoutQuery}
                  cssVars={navColorVars.section}
                />
              ) : null,
            }}
            slotProps={{
              toolbar: {
                sx: {
                  [`& [data-slot="logo"]`]: {
                    display: "none",
                  },
                  [`& [data-area="right"]`]: {
                    gap: { xs: 0, sm: 0.75 },
                  },
                  ...(isNavHorizontal && {
                    bgcolor: "var(--layout-nav-bg)",
                    [`& .${iconButtonClasses.root}`]: {
                      color: "var(--layout-nav-text-secondary-color)",
                    },
                    [theme.breakpoints.up(layoutQuery)]: {
                      height: "var(--layout-nav-horizontal-height)",
                    },
                    [`& [data-slot="workspaces"]`]: {
                      color: "var(--layout-nav-text-primary-color)",
                    },
                    [`& [data-slot="logo"]`]: {
                      display: "none",
                      [theme.breakpoints.up(layoutQuery)]: {
                        display: "inline-flex",
                      },
                    },
                    [`& [data-slot="divider"]`]: {
                      [theme.breakpoints.up(layoutQuery)]: {
                        display: "flex",
                      },
                    },
                  }),
                },
              },
              container: {
                maxWidth: false,
                sx: {
                  ...(isNavVertical && { px: { [layoutQuery]: 5 } }),
                },
              },
            }}
          />
        }
        /** **************************************
         * Sidebar
         *************************************** */
        sidebarSection={
          isNavHorizontal ? null : (
            <NavVertical
              data={navData}
              isNavMini={isNavMini}
              layoutQuery={layoutQuery}
              cssVars={navColorVars.section}
              onToggleNav={() =>
                settings.onUpdateField(
                  "navLayout",
                  settings.navLayout === "vertical" ? "mini" : "vertical",
                )
              }
            />
          )
        }
        /** **************************************
         * Footer
         *************************************** */
        footerSection={null}
        /** **************************************
         * Style
         *************************************** */
        cssVars={{
          ...navColorVars.layout,
          "--layout-transition-easing": "linear",
          "--layout-transition-duration": "120ms",
          "--layout-nav-mini-width": "88px",
          "--layout-nav-vertical-width": "300px",
          "--layout-nav-horizontal-height": "64px",
          "--layout-dashboard-content-pt": theme.spacing(1),
          "--layout-dashboard-content-pb": theme.spacing(8),
          "--layout-dashboard-content-px": theme.spacing(5),
        }}
        sx={{
          [`& .${layoutClasses.hasSidebar}`]: {
            [theme.breakpoints.up(layoutQuery)]: {
              transition: theme.transitions.create(["padding-left"], {
                easing: "var(--layout-transition-easing)",
                duration: "var(--layout-transition-duration)",
              }),
              pl: isNavMini
                ? "var(--layout-nav-mini-width)"
                : "var(--layout-nav-vertical-width)",
            },
          },
          ...sx,
        }}
      >
        <Main isNavHorizontal={isNavHorizontal}>{children}</Main>
      </LayoutSection>
    </>
  );
}
