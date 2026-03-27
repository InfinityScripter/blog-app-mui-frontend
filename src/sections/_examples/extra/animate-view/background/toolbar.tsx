import Stack from "@mui/material/Stack";
import { Iconify } from "src/components/iconify";
import IconButton from "@mui/material/IconButton";

// ----------------------------------------------------------------------

export function Toolbar({ onRefresh, ...other }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      {...other}
    >
      <IconButton onClick={onRefresh}>
        <Iconify icon="eva:refresh-fill" />
      </IconButton>
    </Stack>
  );
}
