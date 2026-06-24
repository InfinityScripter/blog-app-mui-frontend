import { usePathname } from "src/routes/hooks";
import { isExternalLink } from "src/routes/utils";
import { useState, useEffect, useCallback } from "react";
import { useActiveLink } from "src/routes/hooks/use-active-link";

import { NavItem } from "./nav-item";
import { navSectionClasses } from "../classes";
import { NavLi, NavUl, NavCollapse } from "../styles";

import type { NavListProps } from "../types";

// ----------------------------------------------------------------------

export function NavList({
  data,
  render,
  depth,
  slotProps,
  enabledRootRedirect,
}: NavListProps) {
  const pathname = usePathname();

  const active = useActiveLink(data.path, !!data.children);

  const [openMenu, setOpenMenu] = useState(active);

  useEffect(() => {
    if (!active) {
      handleCloseMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleToggleMenu = useCallback(() => {
    if (data.children) {
      setOpenMenu((prev) => !prev);
    }
  }, [data.children]);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);

  const renderNavItem = (
    <NavItem
      render={render}
      // slots
      path={data.path}
      icon={data.icon}
      info={data.info}
      title={data.title}
      caption={data.caption}
      // state
      depth={depth}
      active={active}
      disabled={data.disabled}
      hasChild={!!data.children}
      open={data.children && openMenu}
      externalLink={isExternalLink(data.path)}
      enabledRootRedirect={enabledRootRedirect}
      // styles
      slotProps={depth === 1 ? slotProps?.rootItem : slotProps?.subItem}
      // actions
      onClick={handleToggleMenu}
    />
  );

  // Hidden item by role
  if (data.roles && slotProps?.currentRole) {
    if (!data?.roles?.includes(slotProps?.currentRole)) {
      return null;
    }
  }

  // Has children
  if (data.children) {
    return (
      <NavLi
        disabled={data.disabled}
        sx={{
          [`& .${navSectionClasses.li}`]: {
            "&:first-of-type": { mt: "var(--nav-item-gap)" },
          },
        }}
      >
        {renderNavItem}

        <NavCollapse
          data-group={data.title}
          in={openMenu}
          depth={depth}
          unmountOnExit
          mountOnEnter
        >
          {/* Recurse over children inline (was NavSubList) to avoid a
              NavList <-> NavSubList circular import. */}
          <NavUl sx={{ gap: "var(--nav-item-gap)" }}>
            {data.children.map((list) => (
              <NavList
                key={list.title}
                data={list}
                render={render}
                depth={depth + 1}
                slotProps={slotProps}
                enabledRootRedirect={enabledRootRedirect}
              />
            ))}
          </NavUl>
        </NavCollapse>
      </NavLi>
    );
  }

  // Default
  return <NavLi disabled={data.disabled}>{renderNavItem}</NavLi>;
}
