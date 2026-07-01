import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import Avatar from "@mui/material/Avatar";
import { CONFIG } from "src/config-global";
import { fDate } from "src/utils/format-time";
import Container from "@mui/material/Container";
import SpeedDial from "@mui/material/SpeedDial";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import { useResponsive } from "src/hooks/use-responsive";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { formatImageUrl } from "src/utils/format-image-url";
import { maxLine, varAlpha, bgGradient } from "src/theme/styles";

import { SHARE_TARGETS } from "./const";
import { useCopyShareLink } from "./hooks/use-copy-share-link";

import type { PostDetailsHeroProps } from "./types";

// ----------------------------------------------------------------------

export function PostDetailsHero({
  title,
  author,
  coverUrl,
  createdAt,
  postId,
}: PostDetailsHeroProps) {
  const smUp = useResponsive("up", "sm");

  const formattedCoverUrl = formatImageUrl(coverUrl);

  // Trailing slash matches next.config trailingSlash:true. Empty when there's
  // no postId (draft preview) → the share actions are hidden below.
  const postUrl = postId
    ? `${CONFIG.site.url}${paths.post.details(postId)}/`
    : "";

  const shareTitle = title ?? "";

  const handleCopyLink = useCopyShareLink(postUrl);

  return (
    <Box
      sx={{
        ...bgGradient({
          color: `0deg, ${varAlpha("var(--palette-grey-900Channel)", 0.64)}, ${varAlpha("var(--palette-grey-900Channel)", 0.64)}`,
          imgUrl: formattedCoverUrl,
        }),
        // Responsive hero so the cover doesn't tower on phones.
        height: { xs: 360, md: 480 },
        overflow: "hidden",
      }}
    >
      <Container sx={{ height: 1, position: "relative" }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            zIndex: 9,
            color: "common.white",
            position: "absolute",
            maxWidth: 480,
            pt: { xs: 2, md: 8 },
            // Clamp very long RU news headlines so they can't overflow the hero.
            ...maxLine({ line: 3 }),
          }}
        >
          {title}
        </Typography>

        <Stack
          sx={{
            left: 0,
            width: 1,
            bottom: 0,
            position: "absolute",
          }}
        >
          {author && createdAt && (
            <Stack
              direction="row"
              alignItems="center"
              sx={{ px: { xs: 2, md: 3 }, pb: { xs: 3, md: 8 } }}
            >
              <Avatar
                alt={author.name}
                src={author.avatarUrl}
                sx={{ width: 64, height: 64, mr: 2 }}
              />

              <ListItemText
                sx={{ color: "common.white" }}
                primary={author.name}
                secondary={fDate(createdAt)}
                primaryTypographyProps={{ typography: "subtitle1", mb: 0.5 }}
                secondaryTypographyProps={{
                  color: "inherit",
                  sx: { opacity: 0.64 },
                }}
              />
            </Stack>
          )}

          {postUrl && (
            <SpeedDial
              direction={smUp ? "left" : "up"}
              ariaLabel="Поделиться постом"
              icon={<Iconify icon="solar:share-bold" />}
              FabProps={{ size: "medium" }}
              sx={{
                position: "absolute",
                bottom: { xs: 32, md: 64 },
                right: { xs: 16, md: 24 },
              }}
            >
              {SHARE_TARGETS.map((target) => (
                <SpeedDialAction
                  key={target.name}
                  icon={<Iconify icon={target.icon} />}
                  tooltipTitle={target.tooltip}
                  tooltipPlacement="top"
                  FabProps={{ color: "default" }}
                  // SpeedDialAction's FabProps can't type an anchor with
                  // target/rel (no cast allowed), so open the share intent in a
                  // new tab with noopener/noreferrer instead of an <a href>.
                  onClick={() =>
                    window.open(
                      target.href(postUrl, shareTitle),
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                />
              ))}

              <SpeedDialAction
                icon={<Iconify icon="solar:copy-bold" />}
                tooltipTitle="Скопировать ссылку"
                tooltipPlacement="top"
                FabProps={{ color: "default" }}
                onClick={handleCopyLink}
              />
            </SpeedDial>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
