import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";

import { readingKindIcon } from "./utils";

import type { ReadingItem as ReadingItemType } from "./types";

// ----------------------------------------------------------------------

interface ReadingItemProps {
  item: ReadingItemType;
}

/** One reading-list row: kind icon, title → external link, author, why-read. */
export function ReadingItem({ item }: ReadingItemProps) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        py: 2,
        borderBottom: (t) => `1px solid ${alpha(t.palette.grey[500], 0.12)}`,
      }}
    >
      <Iconify
        width={24}
        icon={readingKindIcon(item.kind)}
        sx={{ color: "text.secondary", mt: 0.25, flexShrink: 0 }}
      />
      <Box sx={{ minWidth: 0 }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ flexWrap: "wrap" }}
        >
          <Link
            href={item.url}
            target="_blank"
            rel="noopener"
            color="inherit"
            underline="hover"
            sx={{ fontWeight: 600 }}
          >
            {item.title}
          </Link>
          <Label variant="soft" color={item.lang === "ru" ? "info" : "default"}>
            {item.lang.toUpperCase()}
          </Label>
        </Stack>
        <Typography
          variant="caption"
          sx={{ color: "text.disabled", display: "block" }}
        >
          {item.author}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          {item.why}
        </Typography>
      </Box>
    </Stack>
  );
}
