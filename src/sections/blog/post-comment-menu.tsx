import MenuItem from "@mui/material/MenuItem";
import { Iconify } from "src/components/iconify";
import { CustomPopover } from "src/components/custom-popover";

// ----------------------------------------------------------------------

interface PostCommentMenuProps {
  open: boolean;
  anchorEl: Element | null;
  deleting: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function PostCommentMenu({
  open,
  anchorEl,
  deleting,
  onClose,
  onEdit,
  onDelete,
}: PostCommentMenuProps) {
  return (
    <CustomPopover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      slotProps={{ arrow: { placement: "bottom-center" } }}
    >
      <MenuItem onClick={onEdit}>
        <Iconify icon="solar:pen-bold" sx={{ mr: 1 }} />
        Редактировать
      </MenuItem>

      <MenuItem
        onClick={onDelete}
        disabled={deleting}
        sx={{ color: "error.main" }}
      >
        <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 1 }} />
        Удалить
      </MenuItem>
    </CustomPopover>
  );
}
