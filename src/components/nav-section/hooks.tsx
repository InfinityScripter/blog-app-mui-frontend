import type { ReactNode, ElementType } from "react";

import { RouterLink } from "src/routes/components";
import { cloneElement, isValidElement } from "react";

import type { NavItemProps } from "./types";

// ----------------------------------------------------------------------

type UseNavItemParams = Pick<
  NavItemProps,
  | "path"
  | "icon"
  | "info"
  | "depth"
  | "render"
  | "hasChild"
  | "externalLink"
  | "enabledRootRedirect"
>;

type NavItemBaseLinkProps = {
  component?: ElementType;
  href?: string;
  target?: string;
  rel?: string;
};

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
