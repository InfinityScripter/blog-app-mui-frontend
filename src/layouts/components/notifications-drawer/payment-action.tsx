import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

// ----------------------------------------------------------------------

export function PaymentAction() {
  return (
    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained">
        Pay
      </Button>
      <Button size="small" variant="outlined">
        Decline
      </Button>
    </Stack>
  );
}
