import type { ReactNode } from "react";

import Box from "@mui/material/Box";
import { varAlpha } from "src/theme/styles";
import { Label } from "src/components/label";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";

// ----------------------------------------------------------------------

/** A segment produced by `autosuggest-highlight/parse`. */
export interface HighlightPart {
  text: string;
  highlight: boolean;
}

export interface ResultItemProps {
  title?: HighlightPart[];
  path?: HighlightPart[];
  groupLabel?: ReactNode;
  onClickItem?: () => void;
  [key: string]: unknown;
}

export function ResultItem({
  title = [],
  path = [],
  groupLabel,
  onClickItem,
}: ResultItemProps) {
  return (
    <ListItemButton
      onClick={onClickItem}
      sx={{
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "transparent",
        borderBottomColor: (theme) => theme.vars.palette.divider,
        "&:hover": {
          borderRadius: 1,
          borderColor: (theme) => theme.vars.palette.primary.main,
          backgroundColor: (theme) =>
            varAlpha(
              theme.vars.palette.primary.mainChannel,
              theme.vars.palette.action.hoverOpacity,
            ),
        },
      }}
    >
      <ListItemText
        primaryTypographyProps={{
          typography: "subtitle2",
          sx: { textTransform: "capitalize" },
        }}
        secondaryTypographyProps={{ typography: "caption", noWrap: true }}
        primary={title.map((part, index) => (
          <Box
            key={index}
            component="span"
            sx={{ color: part.highlight ? "primary.main" : "text.primary" }}
          >
            {part.text}
          </Box>
        ))}
        secondary={path.map((part, index) => (
          <Box
            key={index}
            component="span"
            sx={{ color: part.highlight ? "primary.main" : "text.secondary" }}
          >
            {part.text}
          </Box>
        ))}
      />

      {groupLabel && <Label color="info">{groupLabel}</Label>}
    </ListItemButton>
  );
}
