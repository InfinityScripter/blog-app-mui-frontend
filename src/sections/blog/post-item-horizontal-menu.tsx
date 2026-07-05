"use client";

import { useTranslations } from "next-intl";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { Iconify } from "src/components/iconify";
import { CustomPopover } from "src/components/custom-popover";

import type { PostItemHorizontalMenuProps } from "./types";

// ----------------------------------------------------------------------

export function PostItemHorizontalMenu({
  open,
  anchorEl,
  onClose,
  onView,
  onEdit,
  onDelete,
}: PostItemHorizontalMenuProps) {
  const t = useTranslations("blog");

  return (
    <CustomPopover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      slotProps={{ arrow: { placement: "bottom-center" } }}
    >
      <MenuList>
        <MenuItem onClick={onView}>
          <Iconify icon="solar:eye-bold" />
          {t("itemMenu.view")}
        </MenuItem>
        <MenuItem onClick={onEdit}>
          <Iconify icon="solar:pen-bold" />
          {t("itemMenu.edit")}
        </MenuItem>

        <MenuItem onClick={onDelete} sx={{ color: "error.main" }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t("itemMenu.delete")}
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );
}
