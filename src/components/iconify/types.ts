import type { BoxProps } from "@mui/material/Box";
import type { IconifyIconProps } from "@iconify/react";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { Theme, SxProps } from "@mui/material/styles";

// ----------------------------------------------------------------------

export interface IconifyProps
  extends Omit<
    IconifyIconProps,
    "icon" | "width" | "height" | "color" | "onLoad"
  > {
  className?: string;
  width?: number | string;
  sx?: SxProps<Theme>;
  icon: string;
}

// ----------------------------------------------------------------------

export interface FlagIconProps
  extends Omit<BoxProps, "children" | "component"> {
  code?: string;
  sx?: SxProps<Theme>;
}

// ----------------------------------------------------------------------

/**
 * Ключи инлайновых глифов в social-icon.tsx. Именно union, не string: имя вне
 * switch рендерит пустой SvgIcon — невидимая иконка (кейс logos:vk), а union
 * ловит опечатку на компиляции.
 */
export type SocialIconName =
  | "google"
  | "facebook"
  | "linkedin"
  | "twitter"
  | "instagram"
  | "github"
  | "vk"
  | "telegram"
  | "yandex";

export interface SocialIconProps extends Omit<SvgIconProps, "width"> {
  icon?: SocialIconName;
  width?: number | string;
}
