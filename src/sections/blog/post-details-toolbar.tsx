"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { useTranslations } from "next-intl";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { Iconify } from "src/components/iconify";
import IconButton from "@mui/material/IconButton";
import { PUBLISH_STATUS } from "src/types/domain";
import { RouterLink } from "src/routes/components";
import { usePostDelete } from "src/hooks/use-post-delete";
import { ConfirmDialog } from "src/components/confirm-dialog";
import { usePopover, CustomPopover } from "src/components/custom-popover";

import { usePublishStatusLabel } from "./hooks/use-publish-status-label";

import type { PostDetailsToolbarProps } from "./types";

// ----------------------------------------------------------------------

export function PostDetailsToolbar({
  publish,
  backLink,
  editLink,
  liveLink,
  publishOptions,
  onChangePublish,
  postId,
  sx,
  ...other
}: PostDetailsToolbarProps) {
  const popover = usePopover();
  const t = useTranslations("blog");
  const statusLabel = usePublishStatusLabel();
  const {
    openConfirm,
    loading,
    handleOpenConfirm,
    handleCloseConfirm,
    handleDelete,
  } = usePostDelete();

  const handleClickDelete = () => {
    handleOpenConfirm({ _id: postId });
  };

  return (
    <>
      <Stack
        spacing={1.5}
        direction="row"
        sx={{ mb: { xs: 3, md: 5 }, ...sx }}
        {...other}
      >
        <Button
          component={RouterLink}
          href={backLink}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        >
          {t("toolbar.back")}
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {publish === PUBLISH_STATUS.published && (
          <Tooltip title={t("toolbar.view")}>
            <IconButton component={RouterLink} href={liveLink}>
              <Iconify icon="eva:external-link-fill" />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title={t("toolbar.edit")}>
          <IconButton component={RouterLink} href={editLink}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip>

        <Tooltip title={t("toolbar.delete")}>
          <IconButton onClick={handleClickDelete}>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>

        <Button
          color="inherit"
          variant="contained"
          loading={!publish}
          loadingIndicator={t("toolbar.loading")}
          endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          onClick={popover.onOpen}
          sx={{ textTransform: "capitalize" }}
        >
          {statusLabel(publish)}
        </Button>
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: "top-right" } }}
      >
        <MenuList>
          {publishOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === publish}
              onClick={() => {
                popover.onClose();
                onChangePublish(option.value);
              }}
            >
              {option.value === PUBLISH_STATUS.published && (
                <Iconify icon="eva:cloud-upload-fill" />
              )}
              {option.value === PUBLISH_STATUS.draft && (
                <Iconify icon="solar:file-text-bold" />
              )}
              {statusLabel(option.value)}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title={t("toolbar.deleteTitle")}
        content={t("toolbar.deleteContent")}
        onConfirm={handleDelete}
        loading={loading}
        confirmText={t("toolbar.deleteConfirm")}
        confirmColor="error"
      />
    </>
  );
}
