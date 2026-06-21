import type { ReactNode } from "react";

import { RouterLink } from "src/routes/components";
import { cloneElement, isValidElement } from "react";

import type { UseNavItemParams, NavItemBaseLinkProps } from "./types";

// ----------------------------------------------------------------------

export function useNavItem({
  path,
  icon,
  info,
  depth,
  render,
  hasChild,
  externalLink,
  enabledRootRedirect,
}: UseNavItemParams) {
  const rootItem = depth === 1;

  const subItem = !rootItem;

  const subDeepItem = Number(depth) > 2;

  const linkProps: NavItemBaseLinkProps = externalLink
    ? { href: path, target: "_blank", rel: "noopener" }
    : { component: RouterLink, href: path };

  const baseProps: NavItemBaseLinkProps =
    hasChild && !enabledRootRedirect ? { component: "div" } : linkProps;

  /**
   * Render @icon
   */
  let renderIcon: ReactNode = null;

  if (icon && render?.navIcon && typeof icon === "string") {
    renderIcon = render?.navIcon[icon];
  } else {
    renderIcon = icon;
  }

  /**
   * Render @info
   */
  let renderInfo: ReactNode = null;

  if (info && render?.navInfo && Array.isArray(info)) {
    const [key, value] = info;

    if (typeof key === "string" && typeof value === "string") {
      const element = render.navInfo(value)[key];

      renderInfo = isValidElement(element) ? cloneElement(element) : null;
    }
  } else {
    renderInfo = info;
  }

  return {
    subItem,
    rootItem,
    subDeepItem,
    baseProps,
    renderIcon,
    renderInfo,
  };
}
