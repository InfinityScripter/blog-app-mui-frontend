import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { varAlpha } from "src/theme/styles";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import ListItemButton from "@mui/material/ListItemButton";
import { formatImageUrl } from "src/utils/format-image-url";

import type { PostResultItemProps } from "../types";

// ----------------------------------------------------------------------

// Visual polish (border/hover) matches the dashboard cmd+k ResultItem
// (src/layouts/components/searchbar/result-item.tsx), swapped for a post
// avatar + highlighted title instead of grouped nav text.
export function PostResultItem({ post, query, onClickItem }: PostResultItemProps) {
  const parts = parse(post.title, match(post.title, query));

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
      <Avatar
        alt={post.title}
        src={formatImageUrl(post.coverUrl)}
        variant="rounded"
        sx={{ width: 48, height: 48, flexShrink: 0, mr: 1.5, borderRadius: 1 }}
      />

      <Box component="span" sx={{ typography: "body2" }}>
        {parts.map((part, index) => (
          <Box
            key={`${post._id}-part-${index}`}
            component="span"
            sx={{
              color: part.highlight ? "primary.main" : "text.primary",
              fontWeight: part.highlight ? "fontWeightSemiBold" : "fontWeightMedium",
            }}
          >
            {part.text}
          </Box>
        ))}
      </Box>
    </ListItemButton>
  );
}
