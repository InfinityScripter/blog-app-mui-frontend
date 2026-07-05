"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTranslations } from "next-intl";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { Iconify } from "src/components/iconify";
import { usePopover, CustomPopover } from "src/components/custom-popover";

import { useSortOptionLabel } from "./hooks/use-sort-option-label";

import type { PostSortProps } from "./types";

// ----------------------------------------------------------------------

export function PostSort({ sort, sortOptions, onSort }: PostSortProps) {
  const popover = usePopover();
  const t = useTranslations("blog");
  const sortLabel = useSortOptionLabel();

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={popover.onOpen}
        endIcon={
          <Iconify
            icon={
              popover.open
                ? "eva:arrow-ios-upward-fill"
                : "eva:arrow-ios-downward-fill"
            }
          />
        }
        sx={{ fontWeight: "fontWeightSemiBold", textTransform: "capitalize" }}
      >
        {t("sort.label")}
        <Box component="span" sx={{ ml: 0.5, fontWeight: "fontWeightBold" }}>
          {sortLabel(sort)}
        </Box>
      </Button>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
      >
        <MenuList>
          {sortOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={sort === option.value}
              onClick={() => {
                popover.onClose();
                onSort(option.value);
              }}
            >
              {sortLabel(option.value)}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
