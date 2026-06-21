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
      flexShrink: 0,
      color: "var(--nav-item-color)",
      borderRadius: "var(--nav-item-radius)",
      "&:hover": {
        backgroundColor: "var(--nav-item-hover-bg)",
      },
    },

    title: {
      ...theme.typography.body2,
      fontWeight: active
        ? theme.typography.fontWeightSemiBold
        : theme.typography.fontWeightMedium,
    },

    caption: {
      width: 16,
      height: 16,
      color: "var(--nav-item-caption-color)",
    },

    icon: {
      ...sharedStyles.icon,
      width: "var(--nav-icon-size)",
      height: "var(--nav-icon-size)",
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
      padding: "var(--nav-item-root-padding)",
      minHeight: "var(--nav-item-root-height)",
      [`& .${navSectionClasses.item.icon}`]: {
        ...baseStyles.icon,
        margin: "var(--nav-icon-root-margin)",
      },
      [`& .${navSectionClasses.item.title}`]: {
        ...baseStyles.title,
        whiteSpace: "nowrap",
      },
      [`& .${navSectionClasses.item.caption}`]: {
        ...baseStyles.caption,
        marginLeft: theme.spacing(0.75),
      },
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
      padding: "var(--nav-item-sub-padding)",
      minHeight: "var(--nav-item-sub-height)",
      color: theme.vars.palette.text.secondary,
      [`& .${navSectionClasses.item.icon}`]: {
        ...baseStyles.icon,
        margin: "var(--nav-icon-sub-margin)",
      },
      [`& .${navSectionClasses.item.title}`]: {
        ...baseStyles.title,
        flexGrow: 1,
      },
      [`& .${navSectionClasses.item.caption}`]: { ...baseStyles.caption },
      [`& .${navSectionClasses.item.arrow}`]: {
        ...baseStyles.arrow,
        marginRight: theme.spacing(-0.5),
      },
      [`& .${navSectionClasses.item.info}`]: { ...baseStyles.info },
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

    /* Disabled */
    ...(disabled && sharedStyles.disabled),
  };
});
