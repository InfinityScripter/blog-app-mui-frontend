import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Label } from "src/components/label";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import { FileThumbnail } from "src/components/file-thumbnail";

import { reader } from "./utils";

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

// ----------------------------------------------------------------------

export function ProjectAction() {
  return (
    <Stack alignItems="flex-start">
      <Box
        sx={{
          p: 1.5,
          my: 1.5,
          borderRadius: 1.5,
          color: "text.secondary",
          bgcolor: "background.neutral",
        }}
      >
        {reader(
          `<p><strong>@Jaydon Frankie</strong> feedback by asking questions or just leave a note of appreciation.</p>`,
        )}
      </Box>

      <Button size="small" variant="contained">
        Reply
      </Button>
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function FileAction() {
  return (
    <Stack
      spacing={1}
      direction="row"
      sx={{
        pl: 1,
        p: 1.5,
        mt: 1.5,
        borderRadius: 1.5,
        bgcolor: "background.neutral",
      }}
    >
      <FileThumbnail file="http://localhost:8080/httpsdesign-suriname-2015.mp3" />

      <Stack
        spacing={1}
        direction={{ xs: "column", sm: "row" }}
        flexGrow={1}
        sx={{ minWidth: 0 }}
      >
        <ListItemText
          disableTypography
          primary={
            <Typography
              variant="subtitle2"
              component="div"
              sx={{ color: "text.secondary" }}
              noWrap
            >
              design-suriname-2015.mp3
            </Typography>
          }
          secondary={
            <Stack
              direction="row"
              alignItems="center"
              sx={{ typography: "caption", color: "text.disabled" }}
              divider={
                <Box
                  sx={{
                    mx: 0.5,
                    width: 2,
                    height: 2,
                    borderRadius: "50%",
                    bgcolor: "currentColor",
                  }}
                />
              }
            >
              <span>2.3 GB</span>
              <span>30 min ago</span>
            </Stack>
          }
        />

        <Button size="small" variant="outlined">
          Download
        </Button>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function TagsAction() {
  return (
    <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mt: 1.5 }}>
      <Label variant="outlined" color="info">
        Design
      </Label>
      <Label variant="outlined" color="warning">
        Dashboard
      </Label>
      <Label variant="outlined">Design system</Label>
    </Stack>
  );
}

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
