"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import Avatar from "@mui/material/Avatar";
import { CONFIG } from "src/config-global";
import { useTranslations } from "next-intl";
import { Image } from "src/components/image";
import { fDate } from "src/utils/format-time";
import { monoValueSx } from "src/theme/styles";
import Container from "@mui/material/Container";
import SpeedDial from "@mui/material/SpeedDial";
import Typography from "@mui/material/Typography";
import { useResponsive } from "src/hooks/use-responsive";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { formatImageUrl } from "src/utils/format-image-url";
import { Iconify, SocialIcon } from "src/components/iconify";

import { SHARE_TARGETS } from "./const";
import { useCopyShareLink } from "./hooks/use-copy-share-link";

import type { PostDetailsHeroProps } from "./types";

// ----------------------------------------------------------------------

// Editorial Ink: обложка отдельно (радиус 24, без затемнения), заголовок ПОД
// ней — текст никогда не лежит поверх изображения. Шеринг — SpeedDial у края
// обложки.
export function PostDetailsHero({
  title,
  author,
  coverUrl,
  createdAt,
  postId,
}: PostDetailsHeroProps) {
  const smUp = useResponsive("up", "sm");
  const t = useTranslations("blog");

  const formattedCoverUrl = formatImageUrl(coverUrl);

  // Trailing slash matches next.config trailingSlash:true. Empty when there's
  // no postId (draft preview) → the share actions are hidden below.
  const postUrl = postId
    ? `${CONFIG.site.url}${paths.post.details(postId)}/`
    : "";

  const shareTitle = title ?? "";

  const handleCopyLink = useCopyShareLink(postUrl);

  return (
    <Container sx={{ pt: { xs: 3, md: 5 } }}>
      <Stack spacing={3} sx={{ maxWidth: 860, mx: "auto" }}>
        <Box sx={{ position: "relative" }}>
          <Image
            alt={title}
            src={formattedCoverUrl}
            ratio="21/9"
            sx={{ borderRadius: 3 }}
          />

          {postUrl && (
            <SpeedDial
              direction={smUp ? "left" : "up"}
              ariaLabel={t("share.ariaLabel")}
              icon={<Iconify icon="solar:share-bold" />}
              FabProps={{ size: "medium" }}
              sx={{
                position: "absolute",
                bottom: { xs: 16, md: 24 },
                right: { xs: 16, md: 24 },
              }}
            >
              {SHARE_TARGETS.map((target) => (
                <SpeedDialAction
                  key={target.name}
                  // Инлайновый SVG (SocialIcon), не Iconify: имени vk нет в
                  // наборе logos, и иконка рендерилась пустым span —
                  // невидимая белая кнопка шаринга.
                  icon={<SocialIcon icon={target.name} />}
                  tooltipTitle={t("share.tooltip", { network: target.network })}
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
                tooltipTitle={t("share.copyLink")}
                tooltipPlacement="top"
                FabProps={{ color: "default" }}
                onClick={handleCopyLink}
              />
            </SpeedDial>
          )}
        </Box>

        <Typography variant="h2" component="h1" sx={{ maxWidth: 720 }}>
          {title}
        </Typography>

        {author && createdAt && (
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              alt={author.name}
              src={author.avatarUrl}
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="subtitle2">{author.name}</Typography>
            <Box
              component="span"
              sx={{ ...monoValueSx, color: "text.disabled" }}
            >
              {fDate(createdAt)}
            </Box>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
