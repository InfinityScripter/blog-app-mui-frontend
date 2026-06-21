import type { Post } from "src/types/domain";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import { paths } from "src/routes/paths";
import Avatar from "@mui/material/Avatar";
import { maxLine } from "src/theme/styles";
import { Image } from "src/components/image";
import { fDate } from "src/utils/format-time";
import { coverSrc } from "src/utils/cover-src";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";
import CardContent from "@mui/material/CardContent";
import { AvatarShape } from "src/assets/illustrations";
import { getReadingTime } from "src/utils/reading-time";

import { MAX_TAGS } from "./const";
import { InfoBlock } from "./post-item-info-block";
import { PostItemLatest } from "./post-item-latest";

// Re-exported so existing importers keep `import { ... } from "./post-item"`.
export { InfoBlock, PostItemLatest };

// ----------------------------------------------------------------------

export function PostItem({ post }: { post: Post }) {
  const theme = useTheme();

  const linkTo = paths.post.details(String(post._id));
  const visibleTags = (post.tags ?? []).slice(0, MAX_TAGS);

  return (
    <Card>
      <Box sx={{ position: "relative" }}>
        <AvatarShape
          sx={{
            left: 0,
            zIndex: 9,
            width: 88,
            height: 36,
            bottom: -16,
            position: "absolute",
          }}
        />

        <Avatar
          alt={post.author?.name}
          src={post.author?.avatarUrl}
          sx={{
            left: 24,
            zIndex: 9,
            bottom: -24,
            position: "absolute",
          }}
        />

        <Image
          alt={post.title}
          src={coverSrc(
            post.coverUrl,
            String(post._id ?? post.id ?? post.title),
          )}
          ratio="4/3"
        />
      </Box>

      <CardContent sx={{ pt: 6 }}>
        <Typography
          variant="caption"
          component="div"
          sx={{ mb: 1, color: "text.disabled" }}
        >
          {fDate(post.createdAt)}
        </Typography>

        <Link
          component={RouterLink}
          href={linkTo}
          color="inherit"
          variant="subtitle2"
          sx={{
            ...maxLine({ line: 2, persistent: theme.typography.subtitle2 }),
          }}
        >
          {post.title}
        </Link>

        {visibleTags.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={0.5} sx={{ mt: 1 }}>
            {visibleTags.map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="soft" />
            ))}
          </Box>
        )}

        <InfoBlock
          readingTime={getReadingTime(post.content)}
          totalViews={post.totalViews}
          totalShares={post.totalShares}
          totalComments={post.totalComments}
        />
      </CardContent>
    </Card>
  );
}
