import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import { useTranslations } from "next-intl";
import { Label } from "src/components/label";
import { fDate } from "src/utils/format-time";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";
import { maxLine, monoValueSx } from "src/theme/styles";

import { Thumb } from "./news-thumb";
import { categoryColor } from "./utils";

import type { NewsItemProps } from "./types";

// ----------------------------------------------------------------------

export function NewsItemCard({ item, variant = "list" }: NewsItemProps) {
  const theme = useTheme();
  const t = useTranslations("news");
  const { post, category, source } = item;
  const categoryLabel = t(`categories.${category}`);
  const linkTo = paths.news.details(String(post._id ?? post.id));

  const meta = [source, post.createdAt ? fDate(post.createdAt) : null]
    .filter(Boolean)
    .join(" · ");

  if (variant === "lead") {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 3 },
          alignItems: { sm: "stretch" },
        }}
      >
        <Link
          component={RouterLink}
          href={linkTo}
          sx={{ flex: { sm: "0 0 46%" }, display: "block" }}
        >
          <Thumb
            item={item}
            ratio="16/9"
            sx={{ borderRadius: 2, height: { sm: 1 } }}
          />
        </Link>

        <Stack
          spacing={1.5}
          sx={{ flex: 1, justifyContent: "center", py: 0.5 }}
        >
          <Label
            variant="outlined"
            color={categoryColor(category)}
            sx={{ alignSelf: "flex-start" }}
          >
            {categoryLabel}
          </Label>

          <Link
            component={RouterLink}
            href={linkTo}
            color="text.primary"
            sx={{
              typography: "h4",
              ...maxLine({ line: 3, persistent: theme.typography.h4 }),
              transition: theme.transitions.create("color"),
              "&:hover": { color: "primary.main" },
            }}
          >
            {post.title}
          </Link>

          {meta && (
            <Typography
              component="p"
              sx={{ ...monoValueSx, color: "text.secondary" }}
            >
              {meta}
            </Typography>
          )}
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        py: 2,
        borderTop: `1px solid ${theme.vars.palette.divider}`,
      }}
    >
      <Link
        component={RouterLink}
        href={linkTo}
        sx={{ flex: "0 0 96px", display: "block" }}
      >
        <Thumb item={item} ratio="4/3" sx={{ borderRadius: 1.5, width: 96 }} />
      </Link>

      <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
        <Label
          variant="outlined"
          color={categoryColor(category)}
          sx={{ alignSelf: "flex-start" }}
        >
          {categoryLabel}
        </Label>

        <Link
          component={RouterLink}
          href={linkTo}
          color="text.primary"
          sx={{
            typography: "subtitle1",
            ...maxLine({ line: 2, persistent: theme.typography.subtitle1 }),
            transition: theme.transitions.create("color"),
            "&:hover": { color: "primary.main" },
          }}
        >
          {post.title}
        </Link>

        {meta && (
          <Typography
            component="p"
            sx={{ ...monoValueSx, fontSize: 12, color: "text.secondary" }}
          >
            {meta}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
