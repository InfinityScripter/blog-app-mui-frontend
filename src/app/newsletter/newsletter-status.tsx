import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// ----------------------------------------------------------------------
// Presentational shell for the newsletter confirm / unsubscribe pages.

interface NewsletterStatusProps {
  status: "loading" | "success" | "error";
  message: string;
  loadingText: string;
}

export function NewsletterStatus({
  status,
  message,
  loadingText,
}: NewsletterStatusProps) {
  return (
    <Container sx={{ py: 10 }}>
      <Stack spacing={2} alignItems="center" justifyContent="center">
        {status === "loading" && (
          <>
            <CircularProgress />
            <Typography>{loadingText}</Typography>
          </>
        )}

        {status === "success" && <Alert severity="success">{message}</Alert>}

        {status === "error" && <Alert severity="error">{message}</Alert>}
      </Stack>
    </Container>
  );
}
