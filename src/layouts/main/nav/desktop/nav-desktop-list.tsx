import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import { paper } from "src/theme/styles";
import Portal from "@mui/material/Portal";
import { usePathname } from "src/routes/hooks";
import { useTheme } from "@mui/material/styles";
import { isExternalLink } from "src/routes/utils";
import { NavLi, NavUl } from "src/components/nav-section";
import { useRef, useState, useEffect, useCallback } from "react";
import { useActiveLink } from "src/routes/hooks/use-active-link";

import { NavSubList } from "./nav-sub-list";
import { NavItem } from "./nav-desktop-item";

import type { NavListProps } from "./types";

// ----------------------------------------------------------------------

export function NavList({ data }: NavListProps) {
  const theme = useTheme();

  const navItemRef = useRef<HTMLButtonElement>(null);

  const pathname = usePathname();

  const [openMenu, setOpenMenu] = useState(false);

  const active = useActiveLink(data.path, !!data.children);

  const [clientRect, setClientRect] = useState({ top: 0, height: 0 });

  useEffect(() => {
    if (openMenu) {
      handleCloseMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpenMenu = useCallback(() => {
    if (data.children) {
      setOpenMenu(true);
    }
  }, [data.children]);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);

  const renderNavItem = (
    <NavItem
      ref={navItemRef}
      // slots
      title={data.title}
      path={data.path}
      // state
      active={active}
      hasChild={!!data.children}
      open={data.children && !!openMenu}
      externalLink={isExternalLink(data.path)}
      // action
      onMouseEnter={handleOpenMenu}
      onMouseLeave={handleCloseMenu}
    />
  );

  const handleGetClientRect = useCallback(() => {
    const element = navItemRef.current;

    if (element) {
      const rect = element.getBoundingClientRect();
      setClientRect({ top: rect.top, height: rect.height });
    }
  }, []);

  useEffect(() => {
    handleGetClientRect();

    window.addEventListener("scroll", handleGetClientRect);

    return () => {
      window.removeEventListener("scroll", handleGetClientRect);
    };
  }, [handleGetClientRect]);

  if (data.children) {
    return (
      <NavLi sx={{ height: 1 }}>
        {renderNavItem}

        {openMenu && (
          <Portal>
            <Fade in>
              <Box
                onMouseEnter={handleOpenMenu}
                onMouseLeave={handleCloseMenu}
                sx={{
                  pt: 0.5,
                  left: 0,
                  right: 0,
                  mx: "auto",
                  position: "fixed",
                  zIndex: theme.zIndex.modal,
                  maxWidth: theme.breakpoints.values.lg,
                  top: Math.round(clientRect.top + clientRect.height),
                }}
              >
                <Box
                  component="nav"
                  sx={{
                    ...paper({ theme, dropdown: true }),
                    borderRadius: 2,
                    p: theme.spacing(5, 1, 1, 4),
                  }}
                >
                  <NavUl
                    sx={{
                      gap: 3,
                      width: 1,
                      flexWrap: "wrap",
                      flexDirection: "row",
                    }}
                  >
                    {data.children.map((list) => (
                      <NavSubList
                        key={list.subheader}
                        subheader={list.subheader}
                        data={list.items}
                      />
                    ))}
                  </NavUl>
                </Box>
              </Box>
            </Fade>
          </Portal>
        )}
      </NavLi>
    );
  }

  return <NavLi sx={{ height: 1 }}>{renderNavItem}</NavLi>;
}
