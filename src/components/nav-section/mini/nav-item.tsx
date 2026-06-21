import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

import { useNavItem } from "../hooks";
import { Iconify } from "../../iconify";
import { StyledNavItem } from "./styled";
import { stateClasses } from "../styles";
import { navSectionClasses } from "../classes";

import type { NavItemProps } from "../types";

// ----------------------------------------------------------------------

export const NavItem = forwardRef<HTMLButtonElement, NavItemProps>(
  (
    {
      path,
      icon,
      info,
      title,
      caption,
      //
      open,
      depth,
      render,
      active,
      disabled,
      hasChild,
      slotProps,
      externalLink,
      enabledRootRedirect,
      ...other
    },
    ref,
  ) => {
    const navItem = useNavItem({
      path,
      icon,
      info,
      depth,
      render,
      hasChild,
      externalLink,
      enabledRootRedirect,
    });

    return (
      <StyledNavItem
        ref={ref}
        aria-label={title}
        depth={depth}
        active={active}
        disabled={disabled}
        open={open && !active}
        sx={{
          ...slotProps?.sx,
          [`& .${navSectionClasses.item.icon}`]: slotProps?.icon,
          [`& .${navSectionClasses.item.title}`]: slotProps?.title,
          [`& .${navSectionClasses.item.caption}`]: slotProps?.caption,
          [`& .${navSectionClasses.item.info}`]: slotProps?.info,
          [`& .${navSectionClasses.item.arrow}`]: slotProps?.arrow,
        }}
        className={stateClasses({ open: open && !active, active, disabled })}
        {...navItem.baseProps}
        {...other}
      >
        {icon && (
          <Box component="span" className={navSectionClasses.item.icon}>
            {navItem.renderIcon}
          </Box>
        )}

        {title && (
          <Box component="span" className={navSectionClasses.item.title}>
            {title}
          </Box>
        )}

        {caption && (
          <Tooltip title={caption} arrow placement="right">
            <Iconify
              icon="eva:info-outline"
              className={navSectionClasses.item.caption}
            />
          </Tooltip>
        )}

        {info && navItem.subItem && (
          <Box component="span" className={navSectionClasses.item.info}>
            {navItem.renderInfo}
          </Box>
        )}

        {hasChild && (
          <Iconify
            icon="eva:arrow-ios-forward-fill"
            className={navSectionClasses.item.arrow}
          />
        )}
      </StyledNavItem>
    );
  },
);
