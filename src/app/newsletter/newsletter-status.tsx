import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { alpha } from "@mui/material/styles";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// ----------------------------------------------------------------------
// Presentational shell for the newsletter confirm / unsubscribe pages: a
// centered status card (spinner while loading, then a success/error icon +
// message). On success it auto-redirects home; both terminal states offer a
// "На главную" button so the page is never a dead end.

type NewsletterStatusValue = "loading" | "success" | "error";

interface NewsletterStatusProps {
  status: NewsletterStatusValue;
  message: string;
  loadingText: string;
  redirectIn?: number;
}

export function NewsletterStatus({
  status,
  message,
  loadingText,
  redirectIn,
}: NewsletterStatusProps) {
  const isError = status === "error";
  const paletteKey = isError ? "error" : "success";
  const icon = isError ? "solar:close-circle-bold" : "solar:check-circle-bold";

  return (
    <Container sx={{ py: { xs: 8, md: 12 } }}>
      <Stack
        spacing={3}
        alignItems="center"
        textAlign="center"
        sx={{ mx: "auto", maxWidth: 440 }}
      >
        {status === "loading" ? (
          <>
            <CircularProgress />
            <Typography sx={{ color: "text.secondary" }}>
              {loadingText}
            </Typography>
          </>
        ) : (
          <>
            <Box
              sx={{
                width: 72,
                height: 72,
                display: "flex",
                borderRadius: "50%",
                alignItems: "center",
                justifyContent: "center",
                color: `${paletteKey}.main`,
                bgcolor: (theme) =>
                  alpha(theme.palette[paletteKey].main, 0.12),
              }}
            >
              <Iconify icon={icon} width={40} />
            </Box>

            <Typography variant="h5">{message}</Typography>

            {!isError && redirectIn !== undefined && (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Через {redirectIn} с вернём вас на главную…
              </Typography>
            )}

            <Button href="/" size="large" variant="contained" color="primary">
              На главную
            </Button>
          </>
        )}
      </Stack>
    </Container>
  );
}
