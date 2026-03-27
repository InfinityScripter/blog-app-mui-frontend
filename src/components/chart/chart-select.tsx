import type { Theme, SxProps } from "@mui/material/styles";
import type { ButtonBaseProps } from "@mui/material/ButtonBase";

import { varAlpha } from "src/theme/styles";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { Iconify } from "src/components/iconify";
import ButtonBase from "@mui/material/ButtonBase";

import { usePopover, CustomPopover } from "../custom-popover";

// ----------------------------------------------------------------------

interface ChartSelectProps extends Omit<ButtonBaseProps, "value" | "onChange"> {
  options: string[];
  value: string;
  onChange: (option: string) => void;
  slotProps?: {
    button?: SxProps<Theme>;
    popover?: SxProps<Theme>;
  };
}

export function ChartSelect({
  options,
  value,
  onChange,
  slotProps,
  ...other
}: ChartSelectProps) {
  const popover = usePopover();
  const buttonSx = slotProps?.button;

  return (
    <>
      <ButtonBase
        onClick={popover.onOpen}
        sx={{
          pr: 1,
          pl: 1.5,
          gap: 1.5,
          height: 34,
          borderRadius: 1,
          typography: "subtitle2",
          border: (theme) =>
            `solid 1px ${varAlpha((theme.vars?.palette.grey as Record<string, string> | undefined)?.["500Channel"] ?? theme.palette.grey[500] ?? "145 158 171", 0.24)}`,
          ...(buttonSx as object),
        }}
        {...other}
      >
        {value}

        <Iconify
          width={16}
          icon={
            popover.open
              ? "eva:arrow-ios-upward-fill"
              : "eva:arrow-ios-downward-fill"
          }
        />
      </ButtonBase>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
      >
        <MenuList sx={slotProps?.popover}>
          {options.map((option) => (
            <MenuItem
              key={option}
              selected={option === value}
              onClick={() => {
                popover.onClose();
                onChange(option);
              }}
            >
              {option}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
