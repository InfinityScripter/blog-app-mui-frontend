import type { Theme, SxProps } from "@mui/material/styles";
import type {
  ReactNode,
  ElementType,
  MouseEvent as ReactMouseEvent,
} from "react";

import SvgIcon from "@mui/material/SvgIcon";
import ButtonBase from "@mui/material/ButtonBase";

// ----------------------------------------------------------------------

interface ToolbarItemProps {
  sx?: SxProps<Theme>;
  icon?: ReactNode;
  label?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  component?: ElementType;
  className?: string;
  onClick?: (event: ReactMouseEvent) => void;
}

export function ToolbarItem({
  sx,
  icon,
  label,
  active,
  disabled,
  component,
  ...other
}: ToolbarItemProps) {
  return (
    <ButtonBase
      sx={{
        px: 0.75,
        width: 28,
        height: 28,
        borderRadius: 0.75,
        typography: "body2",
        "&:hover": { bgcolor: "action.hover" },
        ...(active && { bgcolor: "action.selected" }),
        ...(disabled && {
          pointerEvents: "none",
          cursor: "not-allowed",
          opacity: 0.48,
        }),
        ...sx,
      }}
      {...other}
    >
      {icon && <SvgIcon sx={{ fontSize: 18 }}>{icon}</SvgIcon>}

      {label && label}
    </ButtonBase>
  );
}
