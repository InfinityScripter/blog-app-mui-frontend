import { styled } from "@mui/material/styles";
import { stylesMode } from "src/theme/styles";
import ButtonBase from "@mui/material/ButtonBase";

import { sharedStyles } from "../styles";
import { navSectionClasses } from "../classes";

import type { NavItemStateProps } from "../types";

// ----------------------------------------------------------------------

export const StyledNavItem = styled(ButtonBase, {
  shouldForwardProp: (prop) =>
    prop !== "active" &&
    prop !== "open" &&
    prop !== "disabled" &&
    prop !== "depth",
})<NavItemStateProps>(({ active, open, disabled, depth, theme }) => {
  const rootItem = depth === 1;

  const subItem = !rootItem;

  const baseStyles = {
    item: {
      width: "100%",
      paddingTop: "var(--nav-item-pt)",
      paddingLeft: "var(--nav-item-pl)",
      paddingRight: "var(--nav-item-pr)",
      paddingBottom: "var(--nav-item-pb)",
      borderRadius: "var(--nav-item-radius)",
      color: "var(--nav-item-color)",
      "&:hover": {
        backgroundColor: "var(--nav-item-hover-bg)",
      },
    },

    texts: { minWidth: 0, flex: "1 1 auto" },

    title: {
      ...sharedStyles.noWrap,
      ...theme.typography.body2,
      fontWeight: active
        ? theme.typography.fontWeightSemiBold
        : theme.typography.fontWeightMedium,
    },

    caption: {
      ...sharedStyles.noWrap,
      ...theme.typography.caption,
      color: "var(--nav-item-caption-color)",
    },

    icon: {
      ...sharedStyles.icon,
      width: "var(--nav-icon-size)",
      height: "var(--nav-icon-size)",
      margin: "var(--nav-icon-margin)",
    },

    arrow: { ...sharedStyles.arrow },
    info: { ...sharedStyles.info },
  };

  return {
    /**
     * Root item
     */
    ...(rootItem && {
      ...baseStyles.item,
      minHeight: "var(--nav-item-root-height)",
      [`& .${navSectionClasses.item.icon}`]: { ...baseStyles.icon },
      [`& .${navSectionClasses.item.texts}`]: { ...baseStyles.texts },
      [`& .${navSectionClasses.item.title}`]: { ...baseStyles.title },
      [`& .${navSectionClasses.item.caption}`]: { ...baseStyles.caption },
      [`& .${navSectionClasses.item.arrow}`]: { ...baseStyles.arrow },
      [`& .${navSectionClasses.item.info}`]: { ...baseStyles.info },
      // State
      ...(active && {
        color: "var(--nav-item-root-active-color)",
        backgroundColor: "var(--nav-item-root-active-bg)",
        "&:hover": {
          backgroundColor: "var(--nav-item-root-active-hover-bg)",
        },
        [stylesMode.dark]: {
          color: "var(--nav-item-root-active-color-on-dark)",
        },
      }),
      ...(open && {
        color: "var(--nav-item-root-open-color)",
        backgroundColor: "var(--nav-item-root-open-bg)",
      }),
    }),
    /**
     * Sub item
     */
    ...(subItem && {
      ...baseStyles.item,
      minHeight: "var(--nav-item-sub-height)",
      [`& .${navSectionClasses.item.icon}`]: { ...baseStyles.icon },
      [`& .${navSectionClasses.item.texts}`]: { ...baseStyles.texts },
      [`& .${navSectionClasses.item.title}`]: { ...baseStyles.title },
      [`& .${navSectionClasses.item.caption}`]: { ...baseStyles.caption },
      [`& .${navSectionClasses.item.arrow}`]: { ...baseStyles.arrow },
      [`& .${navSectionClasses.item.info}`]: { ...baseStyles.info },
      // Shape
      "&::before": {
        left: 0,
        content: '""',
        position: "absolute",
        width: "var(--nav-bullet-size)",
        height: "var(--nav-bullet-size)",
        transform:
          "translate(calc(var(--nav-bullet-size) * -1), calc(var(--nav-bullet-size) * -0.4))",
        backgroundColor: "var(--nav-bullet-light-color)",
        mask: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' viewBox='0 0 14 14'%3E%3Cpath d='M1 1v4a8 8 0 0 0 8 8h4' stroke='%23efefef' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat 50% 50%/100% auto`,
        WebkitMask: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' viewBox='0 0 14 14'%3E%3Cpath d='M1 1v4a8 8 0 0 0 8 8h4' stroke='%23efefef' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat 50% 50%/100% auto`,
        [stylesMode.dark]: {
          backgroundColor: "var(--nav-bullet-dark-color)",
        },
      },
      // State
      ...(active && {
        color: "var(--nav-item-sub-active-color)",
        backgroundColor: "var(--nav-item-sub-active-bg)",
      }),
      ...(open && {
        color: "var(--nav-item-sub-open-color)",
        backgroundColor: "var(--nav-item-sub-open-bg)",
      }),
    }),
    /**
     * Disabled
     */
    ...(disabled && sharedStyles.disabled),
  };
});
