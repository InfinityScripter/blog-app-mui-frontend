"use client";

import { useTranslations } from "next-intl";
import MenuItem from "@mui/material/MenuItem";
import { Iconify } from "src/components/iconify";
import { CustomPopover } from "src/components/custom-popover";

import type { PostCommentMenuProps } from "./types";

// ----------------------------------------------------------------------

export function PostCommentMenu({
  open,
  anchorEl,
  deleting,
  onClose,
  onEdit,
  onDelete,
}: PostCommentMenuProps) {
  const t = useTranslations("blog");

  return (
    <CustomPopover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      slotProps={{ arrow: { placement: "bottom-center" } }}
    >
      <MenuItem onClick={onEdit}>
        <Iconify icon="solar:pen-bold" sx={{ mr: 1 }} />
        {t("comments.edit")}
      </MenuItem>

      <MenuItem
        onClick={onDelete}
        disabled={deleting}
        sx={{ color: "error.main" }}
      >
        <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 1 }} />
        {t("comments.delete")}
      </MenuItem>
    </CustomPopover>
  );
}
