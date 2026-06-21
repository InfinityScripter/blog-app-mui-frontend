"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { paper, varAlpha } from "src/theme/styles";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import { useTheme, useColorScheme } from "@mui/material/styles";

import { BaseOption } from "./base-option";
import { NavOptions } from "./nav-options";
import { Scrollbar } from "../../scrollbar";
import { FontOptions } from "./font-options";
import { useSettingsContext } from "../context";
import { PresetsOptions } from "./presets-options";
import { SettingsDrawerHead } from "./settings-drawer-head";
import {
  FONT_OPTIONS,
  PRESET_OPTIONS,
  NAV_COLOR_OPTIONS,
  NAV_LAYOUT_OPTIONS,
} from "./const";

import type { SettingsDrawerProps } from "./types";

// ----------------------------------------------------------------------

export function SettingsDrawer({
  sx,
  hideFont,
  hideCompact,
  hidePresets,
  hideNavColor,
  hideContrast,
  hideNavLayout,
  hideDirection,
  hideColorScheme,
}: SettingsDrawerProps = {}) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const { mode, setMode } = useColorScheme();

  const renderMode = (
    <BaseOption
      label="Dark mode"
      icon="moon"
      selected={settings.colorScheme === "dark"}
      onClick={() => {
        settings.onUpdateField(
          "colorScheme",
          mode === "light" ? "dark" : "light",
        );
        setMode(mode === "light" ? "dark" : "light");
      }}
    />
  );

  const renderContrast = (
    <BaseOption
      label="Contrast"
      icon="contrast"
      selected={settings.contrast === "hight"}
      onClick={() =>
        settings.onUpdateField(
          "contrast",
          settings.contrast === "default" ? "hight" : "default",
        )
      }
    />
  );

  const renderRTL = (
    <BaseOption
      label="Right to left"
      icon="align-right"
      selected={settings.direction === "rtl"}
      onClick={() =>
        settings.onUpdateField(
          "direction",
          settings.direction === "ltr" ? "rtl" : "ltr",
        )
      }
    />
  );

  const renderCompact = (
    <BaseOption
      tooltip="Dashboard only and available at large resolutions > 1600px (xl)"
      label="Compact"
      icon="autofit-width"
      selected={settings.compactLayout}
      onClick={() =>
        settings.onUpdateField("compactLayout", !settings.compactLayout)
      }
    />
  );

  const renderPresets = (
    <PresetsOptions
      value={settings.primaryColor}
      onClickOption={(newValue) =>
        settings.onUpdateField("primaryColor", newValue)
      }
      options={PRESET_OPTIONS}
    />
  );

  const renderNav = (
    <NavOptions
      value={{
        color: settings.navColor,
        layout: settings.navLayout,
      }}
      onClickOption={{
        color: (newValue) => settings.onUpdateField("navColor", newValue),
        layout: (newValue) => settings.onUpdateField("navLayout", newValue),
      }}
      options={{
        colors: NAV_COLOR_OPTIONS,
        layouts: NAV_LAYOUT_OPTIONS,
      }}
      hideNavColor={hideNavColor}
      hideNavLayout={hideNavLayout}
    />
  );

  const renderFont = (
    <FontOptions
      value={settings.fontFamily}
      onClickOption={(newValue) =>
        settings.onUpdateField("fontFamily", newValue)
      }
      options={FONT_OPTIONS}
    />
  );

  return (
    <Drawer
      anchor="right"
      open={settings.openDrawer}
      onClose={settings.onCloseDrawer}
      slotProps={{ backdrop: { invisible: true } }}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          ...paper({
            theme,
            color: varAlpha(theme.vars.palette.background.defaultChannel, 0.9),
          }),
          width: 360,
          ...sx,
        },
      }}
    >
      <SettingsDrawerHead />

      <Scrollbar>
        <Stack spacing={6} sx={{ px: 2.5, pb: 5 }}>
          <Box gap={2} display="grid" gridTemplateColumns="repeat(2, 1fr)">
            {!hideColorScheme && renderMode}
            {!hideContrast && renderContrast}
            {!hideDirection && renderRTL}
            {!hideCompact && renderCompact}
          </Box>
          {!(hideNavLayout && hideNavColor) && renderNav}
          {!hidePresets && renderPresets}
          {!hideFont && renderFont}
        </Stack>
      </Scrollbar>
    </Drawer>
  );
}
