import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useColorScheme } from "@mui/material/styles";

import { Iconify } from "../../iconify";
import { useSettingsContext } from "../context";
import { defaultSettings } from "../config-settings";
import { FullScreenButton } from "./fullscreen-button";

// ----------------------------------------------------------------------

export function SettingsDrawerHead() {
  const settings = useSettingsContext();

  const { setMode } = useColorScheme();

  return (
    <Box display="flex" alignItems="center" sx={{ py: 2, pr: 1, pl: 2.5 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Settings
      </Typography>

      <FullScreenButton />

      <Tooltip title="Reset">
        <IconButton
          onClick={() => {
            settings.onReset();
            setMode(defaultSettings.colorScheme);
          }}
        >
          <Badge color="error" variant="dot" invisible={!settings.canReset}>
            <Iconify icon="solar:restart-bold" />
          </Badge>
        </IconButton>
      </Tooltip>

      <Tooltip title="Close">
        <IconButton onClick={settings.onCloseDrawer}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
