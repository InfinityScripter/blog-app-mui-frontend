"use client";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import { tagLabel } from "src/utils/tag-labels";
import { RouterLink } from "src/routes/components";
import { useAppLocale } from "src/hooks/use-app-locale";

// ----------------------------------------------------------------------

interface PostDetailsTagsProps {
  tags: string[];
}

// Теги под статьёй. Подпись переводится под язык страницы, а адрес ссылки
// остаётся исходным тегом — по нему бэкенд отдаёт архив, и на нём же держатся
// карта сайта и hreflang-альтернативы.
export function PostDetailsTags({ tags }: PostDetailsTagsProps) {
  const locale = useAppLocale();

  return (
    <Stack direction="row" flexWrap="wrap" spacing={1}>
      {tags.map((tag) => (
        <Chip
          key={tag}
          label={tagLabel(tag, locale)}
          variant="outlined"
          clickable
          component={RouterLink}
          href={paths.tag.details(tag)}
        />
      ))}
    </Stack>
  );
}
