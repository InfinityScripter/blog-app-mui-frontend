import Box from "@mui/material/Box";
import { useTranslations } from "next-intl";
import { EmptyContent } from "src/components/empty-content";

import { toNewsItem } from "./utils";
import { NewsItemCard } from "./news-item";

import type { NewsListProps } from "./types";

// ----------------------------------------------------------------------

/**
 * Editorial feed: the newest post as a large lead card, the rest as a dense list
 * of compact rows separated by hairline rules.
 */
export function NewsList({ posts }: NewsListProps) {
  const t = useTranslations("news");

  if (posts.length === 0) {
    return (
      <EmptyContent
        title={t("empty.feedTitle")}
        description={t("empty.feedDescription")}
        sx={{ py: 10 }}
      />
    );
  }

  const [lead, ...rest] = posts;

  return (
    <Box>
      <Box sx={{ mb: { xs: 4, md: 5 } }}>
        <NewsItemCard item={toNewsItem(lead)} variant="lead" />
      </Box>

      <Box>
        {rest.map((post) => (
          <NewsItemCard
            key={String(post._id ?? post.id)}
            item={toNewsItem(post)}
            variant="list"
          />
        ))}
      </Box>
    </Box>
  );
}
