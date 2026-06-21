import type { ReactNode } from "react";

import { Logo } from "src/components/logo";
import { styled, useTheme } from "@mui/material/styles";

import { MenuButton } from "../components/menu-button";
import { WorkspacesPopover } from "../components/workspaces-popover";

import type { HeaderLeftAreaProps } from "./types";

// ----------------------------------------------------------------------

const StyledDivider = styled("span")(({ theme }) => ({
  width: 1,
  height: 10,
  flexShrink: 0,
  display: "none",
  position: "relative",
  alignItems: "center",
  flexDirection: "column",
  marginLeft: theme.spacing(2.5),
  marginRight: theme.spacing(2.5),
  backgroundColor: "currentColor",
  color: theme.vars.palette.divider,
  "&::before, &::after": {
    top: -5,
    width: 3,
    height: 3,
    content: '""',
    flexShrink: 0,
    borderRadius: "50%",
    position: "absolute",
    backgroundColor: "currentColor",
  },
  "&::after": { bottom: -5, top: "auto" },
}));

// ----------------------------------------------------------------------

export function HeaderLeftArea({
  data,
  slots,
  onOpenNav,
  layoutQuery,
  menuButton,
  workspaces,
}: HeaderLeftAreaProps): ReactNode {
  const theme = useTheme();

  return (
    <>
      {slots?.leftAreaStart}

      {/* -- Menu button -- */}
      {menuButton && (
        <MenuButton
          data-slot="menu-button"
          onClick={onOpenNav}
          sx={{
            mr: 1,
            ml: -1,
            [theme.breakpoints.up(layoutQuery)]: { display: "none" },
          }}
        />
      )}

      {/* -- Logo -- */}
      <Logo data-slot="logo" />

      {/* -- Divider -- */}
      <StyledDivider data-slot="divider" />

      {/* -- Workspace popover -- */}
      {workspaces && (
        <WorkspacesPopover data-slot="workspaces" data={data?.workspaces} />
      )}

      {slots?.leftAreaEnd}
    </>
  );
}
