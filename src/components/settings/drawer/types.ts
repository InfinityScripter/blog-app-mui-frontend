import type { ReactNode } from "react";
import type { Theme, SxProps } from "@mui/material/styles";
import type { ButtonBaseProps } from "@mui/material/ButtonBase";

import type { SettingsState } from "../config-settings";

// ----------------------------------------------------------------------

export interface BlockProps {
  title: string;
  tooltip?: ReactNode;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export interface BaseOptionProps extends ButtonBaseProps {
  icon: string;
  label: string;
  tooltip?: ReactNode;
  selected: boolean;
}

export interface FontOptionsProps {
  value: SettingsState["fontFamily"];
  options: SettingsState["fontFamily"][];
  onClickOption: (newValue: SettingsState["fontFamily"]) => void;
}

export interface PresetOption {
  name: SettingsState["primaryColor"];
  value: string;
}

export interface PresetsOptionsProps {
  value: SettingsState["primaryColor"];
  options: PresetOption[];
  onClickOption: (newValue: SettingsState["primaryColor"]) => void;
}

export interface NavOptionsProps {
  value: {
    color: SettingsState["navColor"];
    layout: SettingsState["navLayout"];
  };
  options: {
    colors: SettingsState["navColor"][];
    layouts: SettingsState["navLayout"][];
  };
  onClickOption: {
    color: (newValue: SettingsState["navColor"]) => void;
    layout: (newValue: SettingsState["navLayout"]) => void;
  };
  hideNavColor?: boolean;
  hideNavLayout?: boolean;
}

export interface LayoutOptionProps extends ButtonBaseProps {
  option: SettingsState["navLayout"];
  selected: boolean;
}

export interface ColorOptionProps extends ButtonBaseProps {
  option: SettingsState["navColor"];
  selected: boolean;
}
