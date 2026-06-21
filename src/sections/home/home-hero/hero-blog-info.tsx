import Link from "@mui/material/Link";
import { varAlpha } from "src/theme/styles";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";

import { MInview } from "./m-inview";
import { HERO_BLOG_INFO_TITLE, HERO_BLOG_INFO_DESCRIPTION } from "./const";

import type { HeroContentProps } from "./types";

// ----------------------------------------------------------------------

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
