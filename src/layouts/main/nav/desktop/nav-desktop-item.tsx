import { forwardRef } from "react";
import { styled } from "@mui/material/styles";
import { Iconify } from "src/components/iconify";
import ButtonBase from "@mui/material/ButtonBase";
import { useNavItem } from "src/components/nav-section/hooks";

import type { MainNavItemProps } from "../types";
import type { StyledNavItemProps } from "./types";

// ----------------------------------------------------------------------

export const NavItem = forwardRef<HTMLButtonElement, MainNavItemProps>(
  (
    { title, path, open, active, hasChild, externalLink, subItem, ...other },
    ref,
  ) => {
    const navItem = useNavItem({ path, hasChild, externalLink });

    return (
      <StyledNavItem
        disableRipple
        ref={ref}
        aria-label={title}
        open={open}
        active={active}
        subItem={subItem}
        {...navItem.baseProps}
        {...other}
      >
        {title}

        {hasChild && (
          <Iconify
            width={16}
            icon="eva:arrow-ios-downward-fill"
            sx={{ ml: 0.75 }}
          />
        )}
      </StyledNavItem>
    );
  },
);

// ----------------------------------------------------------------------

const StyledNavItem = styled(ButtonBase, {
  shouldForwardProp: (prop) =>
    prop !== "active" && prop !== "open" && prop !== "subItem",
})<StyledNavItemProps>(({ active, open, subItem, theme }) => {
  const rootItem = !subItem;

  const baseStyles = {
    item: {
      ...theme.typography.body2,
      fontWeight: theme.typography.fontWeightSemiBold,
      transition: theme.transitions.create(
        ["color", "opacity", "background-color"],
        {
          duration: theme.transitions.duration.shorter,
        },
      ),
    },
    dot: {
      width: 6,
      height: 6,
      left: -12,
      opacity: 0.64,
      content: '""',
      borderRadius: "50%",
      position: "absolute",
      backgroundColor: theme.vars.palette.text.disabled,
      ...(active && {
        opacity: 1,
        backgroundColor: theme.vars.palette.primary.main,
      }),
    },
  };

  return {
    /**
     * Root item
     */
    ...(rootItem && {
      ...baseStyles.item,
      height: "100%",
      position: "relative",
      // Multi-word labels («LLM history», «Compare LLMs») must not wrap to a
      // second line — that breaks the row rhythm.
      whiteSpace: "nowrap",
      "&:hover": { color: theme.vars.palette.primary.main },
      // Active state is vermilion + bold. An underline used to sit here too,
      // but the item is full header height, so `bottom` anchored it to the
      // header's edge — a bar floating well below the label.
      ...(active && {
        color: theme.vars.palette.primary.main,
        fontWeight: theme.typography.fontWeightBold,
      }),
      ...(open && { opacity: 0.64 }),
    }),

    /**
     * Sub item
     */
    ...(subItem && {
      ...baseStyles.item,
      justifyContent: "flex-start",
      color: theme.vars.palette.text.secondary,
      fontSize: theme.typography.pxToRem(13),
      "&:hover": {
        color: theme.vars.palette.text.primary,
        "&::before": baseStyles.dot,
      },
      ...(active && {
        color: theme.vars.palette.text.primary,
        fontWeight: theme.typography.fontWeightSemiBold,
        "&::before": baseStyles.dot,
      }),
    }),
  };
});
