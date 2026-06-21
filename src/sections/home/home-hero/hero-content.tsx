import type { Theme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";
import { varAlpha, marketingHeroCtaRowSx } from "src/theme/styles";
import { MarketingGradientHighlight } from "src/components/marketing";

import { MInview } from "./m-inview";
import {
  LG_KEY,
  SM_KEY,
  HERO_LABEL,
  HERO_TITLE,
  HERO_SUMMARY,
  HERO_HIGHLIGHT,
  HERO_HEADLINE_SIZE,
  HERO_BLOG_INFO_TITLE,
  HERO_HEADLINE_MAX_WIDTH,
  HERO_HEADLINE_LINE_HEIGHT,
  HERO_BLOG_INFO_DESCRIPTION,
} from "./const";

// ----------------------------------------------------------------------

interface HeroContentProps {
  theme: Theme;
}

// Заголовок главной страницы с фокусом на блоге
export function HeroHeading({ theme }: HeroContentProps) {
  return (
    <MInview>
      <Box
        component="h1"
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        sx={{
          ...theme.typography.h2,
          my: 0,
          mx: "auto",
          maxWidth: HERO_HEADLINE_MAX_WIDTH,
          fontFamily: theme.typography.fontSecondaryFamily,
          fontSize: HERO_HEADLINE_SIZE,
          lineHeight: HERO_HEADLINE_LINE_HEIGHT,
        }}
      >
        <Box component="span" sx={{ width: 1, opacity: 0.24, mr: 1 }}>
          {HERO_LABEL}
        </Box>
        <MarketingGradientHighlight>
          {HERO_HIGHLIGHT}
        </MarketingGradientHighlight>
      </Box>
      <Box
        component="h2"
        sx={{ mt: 1, textAlign: "center", ...theme.typography.h5 }}
      >
        {HERO_TITLE}
      </Box>
    </MInview>
  );
}

// Краткое описание тем блога
export function HeroText({ theme }: HeroContentProps) {
  return (
    <MInview>
      <Typography
        variant="body2"
        sx={{
          mx: "auto",
          [theme.breakpoints.up(SM_KEY)]: { whiteSpace: "pre-line" },
          [theme.breakpoints.up(LG_KEY)]: { fontSize: 20, lineHeight: "36px" },
        }}
      >
        {HERO_SUMMARY}
      </Typography>
    </MInview>
  );
}

// Кнопки для перехода к портфолио и статьям
export function HeroButtons() {
  return (
    <Box sx={marketingHeroCtaRowSx}>
      <MInview>
        <Button
          component={Link}
          href="/portfolio"
          color="primary"
          size="large"
          variant="contained"
          startIcon={
            <Iconify width={24} icon="solar:user-circle-bold-duotone" />
          }
        >
          Обо мне
        </Button>
      </MInview>
      <MInview>
        <Button
          component={Link}
          href="/post"
          color="primary"
          size="large"
          variant="outlined"
          startIcon={
            <Iconify width={24} icon="mdi:newspaper-variant-outline" />
          }
        >
          Читать блог
        </Button>
      </MInview>
    </Box>
  );
}

// Информация о блоге — кликабельный тизер, ведёт в блог (иначе это тупик:
// заголовок «Новые материалы» без списка постов и без перехода).
export function HeroBlogInfo({ theme }: HeroContentProps) {
  return (
    <MInview>
      <Link
        component={RouterLink}
        href="/post"
        underline="none"
        color="inherit"
        sx={{
          display: "block",
          textAlign: "center",
          maxWidth: 600,
          mx: "auto",
          mt: 2,
          borderRadius: 2,
          p: 2,
          transition: theme.transitions.create([
            "background-color",
            "transform",
          ]),
          "&:hover": {
            transform: "translateY(-2px)",
            bgcolor: varAlpha(theme.vars.palette.grey["500Channel"], 0.08),
          },
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            mb: 1,
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          {HERO_BLOG_INFO_TITLE}
          <Iconify width={18} icon="eva:arrow-ios-forward-fill" />
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {HERO_BLOG_INFO_DESCRIPTION}
        </Typography>
      </Link>
    </MInview>
  );
}
