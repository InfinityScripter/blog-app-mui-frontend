import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import { FileThumbnail } from "src/components/file-thumbnail";

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
