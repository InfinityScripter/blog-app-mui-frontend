import type { AuthorInfo } from "src/types/domain";

import Box from "@mui/material/Box";
import { _socials } from "src/_mock";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { fDate } from "src/utils/format-time";
import Container from "@mui/material/Container";
import SpeedDial from "@mui/material/SpeedDial";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import { useResponsive } from "src/hooks/use-responsive";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { formatImageUrl } from "src/utils/format-image-url";
import { Iconify, SocialIcon } from "src/components/iconify";
import { maxLine, varAlpha, bgGradient } from "src/theme/styles";

// ----------------------------------------------------------------------

interface PostDetailsHeroProps {
  title?: string;
  author?: AuthorInfo;
  coverUrl?: string;
  createdAt?: string | Date;
}

export function PostDetailsHero({
  title,
  author,
  coverUrl,
  createdAt,
}: PostDetailsHeroProps) {
  const smUp = useResponsive("up", "sm");

  const formattedCoverUrl = formatImageUrl(coverUrl);

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
            {_socials.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={<SocialIcon icon={action.name} />}
                tooltipTitle={action.name}
                tooltipPlacement="top"
                FabProps={{ color: "default" }}
              />
            ))}
          </SpeedDial>
        </Stack>
      </Container>
    </Box>
  );
}
