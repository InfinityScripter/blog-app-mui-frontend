import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

// ----------------------------------------------------------------------

export function FriendAction() {
  return (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained">
        Accept
      </Button>
      <Button size="small" variant="outlined">
        Decline
      </Button>
    </Stack>
  );
}
