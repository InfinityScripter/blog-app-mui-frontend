import type { Post } from "src/types/domain";

import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import { paths } from "src/routes/paths";
import Avatar from "@mui/material/Avatar";
import { Image } from "src/components/image";
import { fDate } from "src/utils/format-time";
import { coverSrc } from "src/utils/cover-src";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";
import CardContent from "@mui/material/CardContent";
import { maxLine, varAlpha } from "src/theme/styles";

import { InfoBlock } from "./post-item-info-block";

// ----------------------------------------------------------------------

export function PostItemLatest({ post, index }: { post: Post; index: number }) {
  const theme = useTheme();

  const linkTo = paths.post.details(String(post._id));

  const postSmall = index === 1 || index === 2;

  return (
    <Card>
      <Avatar
        alt={post.author?.name}
        src={post.author?.avatarUrl}
        sx={{
          top: 24,
          left: 24,
          zIndex: 9,
          position: "absolute",
        }}
      />

      <Image
        alt={post.title}
        src={coverSrc(post.coverUrl, String(post._id ?? post.id ?? post.title))}
        ratio="4/3"
        // The first featured cover is the LCP element on the blog list — load
        // it eagerly instead of lazily so it doesn't gate Largest Contentful
        // Paint on mobile.
        visibleByDefault={index === 0}
        // Let the 4/3 ratio reserve space on mobile (no fixed height → no CLS);
        // pin the 360px featured height only from md up, where the overlay
        // layout expects it.
        sx={{ height: { xs: "auto", md: 360 } }}
        slotProps={{
          overlay: {
            bgcolor: varAlpha("var(--palette-grey-900Channel)", 0.48),
          },
        }}
      />

      <CardContent
        sx={{
          width: 1,
          zIndex: 9,
          bottom: 0,
          position: "absolute",
          color: "common.white",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ mb: 1, opacity: 0.64 }}
        >
          {fDate(post.createdAt)}
        </Typography>

        <Link
          component={RouterLink}
          href={linkTo}
          color="inherit"
          variant={postSmall ? "subtitle2" : "h5"}
          sx={{
            ...maxLine({
              line: 2,
              persistent: postSmall
                ? theme.typography.subtitle2
                : theme.typography.h5,
            }),
          }}
        >
          {post.title}
        </Link>

        <InfoBlock
          totalViews={post.totalViews}
          totalShares={post.totalShares}
          totalComments={post.totalComments}
          sx={{ opacity: 0.64, color: "common.white" }}
        />
      </CardContent>
    </Card>
  );
}
