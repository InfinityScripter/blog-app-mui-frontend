import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { Iconify } from "src/components/iconify";
import { CustomPopover } from "src/components/custom-popover";

// ----------------------------------------------------------------------

interface PostItemHorizontalMenuProps {
  open: boolean;
  anchorEl: Element | null;
  onClose: () => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function PostItemHorizontalMenu({
  open,
  anchorEl,
  onClose,
  onView,
  onEdit,
  onDelete,
}: PostItemHorizontalMenuProps) {
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
          View
        </MenuItem>
        <MenuItem onClick={onEdit}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem onClick={onDelete} sx={{ color: "error.main" }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );
}
