import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import Button from "@mui/material/Button";
import { useTranslations } from "next-intl";
import { fDate } from "src/utils/format-time";
import { useGetPosts } from "src/actions/blog";
import { monoLabelSx } from "src/theme/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";
import { useAppLocale } from "src/hooks/use-app-locale";

import { HOME_TOOL_LINKS, FRESH_POSTS_COUNT } from "./const";

// ----------------------------------------------------------------------

export function HomeFresh() {
  const t = useTranslations("home");
  const locale = useAppLocale();
  const { posts } = useGetPosts({ limit: FRESH_POSTS_COUNT });

  return (
    <Container component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "flex-end" },
          mb: 4,
        }}
      >
        <Stack spacing={1}>
          <Typography component="p" sx={monoLabelSx}>
            {t("fresh.overline")}
          </Typography>
          <Typography component="h2" variant="h3">
            {t("fresh.title")}
          </Typography>
        </Stack>
        <Button
          component={RouterLink}
          href={paths.news.root}
          color="inherit"
          variant="outlined"
        >
          {t("fresh.all")}
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {posts.map((post) => {
          const id = post.id ?? post._id;
          if (!id) return null;
          return (
            <Grid key={id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ p: 3, height: 1 }}>
                <Stack spacing={1}>
                  <Typography variant="caption" sx={{ color: "text.disabled" }}>
                    {fDate(post.createdAt, locale)}
                  </Typography>
                  <Link
                    component={RouterLink}
                    href={paths.post.details(id)}
                    color="inherit"
                    variant="subtitle1"
                  >
                    {post.title}
                  </Link>
                  {post.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {post.description}
                    </Typography>
                  )}
                </Stack>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Stack
        direction="row"
        spacing={3}
        useFlexGap
        sx={{ flexWrap: "wrap", alignItems: "baseline", mt: 6 }}
      >
        <Typography component="span" sx={monoLabelSx}>
          {t("links.title")}
        </Typography>
        {HOME_TOOL_LINKS.map((item) => (
          <Link
            key={item.key}
            component={RouterLink}
            href={item.href}
            variant="subtitle2"
          >
            {t(`links.${item.key}`)}
          </Link>
        ))}
      </Stack>
    </Container>
  );
}
