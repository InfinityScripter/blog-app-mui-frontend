import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";

import { useRouter } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

import { usePostDelete } from "src/hooks/use-post-delete";

import { Iconify } from "src/components/iconify";
import { ConfirmDialog } from "src/components/confirm-dialog";
import { usePopover, CustomPopover } from "src/components/custom-popover";

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
}) {
  const popover = usePopover();
  const router = useRouter();
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
          Назад
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {publish === "published" && (
          <Tooltip title="Просмотреть">
            <IconButton component={RouterLink} href={liveLink}>
              <Iconify icon="eva:external-link-fill" />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Редактировать">
          <IconButton component={RouterLink} href={editLink}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Удалить">
          <IconButton onClick={handleClickDelete}>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>

        <LoadingButton
          color="inherit"
          variant="contained"
          loading={!publish}
          loadingIndicator="Загрузка…"
          endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          onClick={popover.onOpen}
          sx={{ textTransform: "capitalize" }}
        >
          {publish}
        </LoadingButton>
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
              {option.value === "published" && (
                <Iconify icon="eva:cloud-upload-fill" />
              )}
              {option.value === "draft" && (
                <Iconify icon="solar:file-text-bold" />
              )}
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Удалить пост"
        content="Вы уверены, что хотите удалить этот пост?"
        onConfirm={handleDelete}
        loading={loading}
        confirmText="Удалить"
        confirmColor="error"
      />
    </>
  );
}
