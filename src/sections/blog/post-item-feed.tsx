import type { ReactNode } from "react";
import type { Post } from "src/types/domain";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import { maxLine } from "src/theme/styles";
import { Image } from "src/components/image";
import { fToNow } from "src/utils/format-time";
import { coverSrc } from "src/utils/cover-src";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";
import { getReadingTime } from "src/utils/reading-time";
import { fShortenNumber } from "src/utils/format-number";

// ----------------------------------------------------------------------

// Feed card for the public landing — Habr/vc.ru style horizontal row. No admin
// menu, no publish Label (only published posts reach the feed). Cover sits on
// the right and hides on xs.
const MAX_TAGS = 2;

type PostItemFeedProps = {
  post: Post;
};

function InfoBlock({ icon, value }: { icon: string; value: ReactNode }) {
  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      <Iconify icon={icon} width={16} />
      {value}
    </Box>
  );
}

export function PostItemFeed({ post }: PostItemFeedProps) {
  const { title, coverUrl, createdAt, totalViews, description, tags, content } =
    post;

  const href = paths.post.details(post.id ?? "");
  const readingTime = getReadingTime(content);
  const visibleTags = (tags ?? []).slice(0, MAX_TAGS);
  const cover = coverSrc(coverUrl, String(post._id ?? post.id ?? title));

  return (
    <Card sx={{ display: "flex" }}>
      <Stack spacing={1} sx={{ p: 3, flexGrow: 1, minWidth: 0 }}>
        {visibleTags.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={0.5}>
            {visibleTags.map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="soft" />
            ))}
          </Box>
        )}

        <Link
          component={RouterLink}
          href={href}
          color="inherit"
          variant="h6"
          sx={{ ...maxLine({ line: 2 }) }}
        >
          {title}
        </Link>

        <Typography
          variant="body2"
          sx={{ ...maxLine({ line: 2 }), color: "text.secondary", flexGrow: 1 }}
        >
          {description}
        </Typography>

        <Box
          gap={1.5}
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          sx={{ mt: 1, typography: "caption", color: "text.disabled" }}
        >
          <Box component="span">{fToNow(createdAt)}</Box>
          <InfoBlock
            icon="solar:clock-circle-bold"
            value={`${readingTime} мин`}
          />
          <InfoBlock icon="solar:eye-bold" value={fShortenNumber(totalViews)} />
        </Box>
      </Stack>

      <Box
        sx={{
          p: 1,
          width: 200,
          height: 180,
          flexShrink: 0,
          position: "relative",
          display: { xs: "none", sm: "block" },
        }}
      >
        <Image alt={title} src={cover} sx={{ height: 1, borderRadius: 1.5 }} />
      </Box>
    </Card>
  );
}
