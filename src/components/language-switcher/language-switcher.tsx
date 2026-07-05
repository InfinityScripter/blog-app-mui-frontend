"use client";

import { useState } from "react";
import Menu from "@mui/material/Menu";
import { useTranslations } from "next-intl";
import SvgIcon from "@mui/material/SvgIcon";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";

import { useLanguageSwitcher } from "./hooks/use-language-switcher";

import type { LanguageSwitcherProps } from "./types";

// ----------------------------------------------------------------------

// Header language control: a globe icon-button (sized to match SettingsButton)
// that opens a menu of the site's locales. The active language is checked; the
// Russian option is labelled as the original. Selecting a language swaps the
// URL prefix and persists the choice.
export function LanguageSwitcher({ sx, ...other }: LanguageSwitcherProps) {
  const t = useTranslations("common");
  const { locale, locales, meta, change } = useLanguageSwitcher();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);

  const handleSelect = (next: (typeof locales)[number]) => {
    change(next);
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label={t("language")}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{ p: 0, width: 40, height: 40, ...sx }}
        {...other}
      >
        <SvgIcon>
          {/* solar:global-linear */}
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2S2 6.477 2 12Zm10-10c2.5 2.5 3.5 6 3.5 10s-1 7.5-3.5 10c-2.5-2.5-3.5-6-3.5-10s1-7.5 3.5-10ZM2.5 9h19M2.5 15h19"
          />
        </SvgIcon>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { minWidth: 180 } } }}
      >
        {locales.map((code) => (
          <MenuItem
            key={code}
            selected={code === locale}
            onClick={() => handleSelect(code)}
          >
            <Typography
              component="span"
              sx={{ mr: 1.5, fontSize: 18, lineHeight: 1 }}
            >
              {meta[code].flag}
            </Typography>
            <ListItemText
              primary={
                code === "ru" ? t("languageOriginal") : meta[code].native
              }
              primaryTypographyProps={{ variant: "body2" }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
