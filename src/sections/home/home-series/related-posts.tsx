import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import { useTranslations } from "next-intl";
import { useGetPosts } from "src/actions/blog";
import { monoLabelSx } from "src/theme/styles";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";

import { pickRelatedPosts } from "./utils";
import { RELATED_POSTS_POOL, RELATED_POSTS_COUNT } from "./const";

// ----------------------------------------------------------------------

interface RelatedPostsProps {
  tags?: string[];
}

export function RelatedPosts({ tags }: RelatedPostsProps) {
  const t = useTranslations("home.series");
  const { posts } = useGetPosts({ limit: RELATED_POSTS_POOL });
  const related = pickRelatedPosts(posts, tags, RELATED_POSTS_COUNT);

  if (!related.length) return null;

  return (
    <Stack spacing={1}>
      <Typography component="p" sx={monoLabelSx}>
        {t("relatedTitle")}
      </Typography>
      {related.map((post) => {
        const id = post.id ?? post._id;
        if (!id) return null;
        return (
          <Link
            key={id}
            component={RouterLink}
            href={paths.post.details(id)}
            variant="subtitle2"
          >
            {post.title}
          </Link>
        );
      })}
    </Stack>
  );
}
