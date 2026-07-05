"use client";

import Box from "@mui/material/Box";
import { useTranslations } from "next-intl";
import { monoLabelSx } from "src/theme/styles";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

// BLUF ("bottom line up front") — the post's one-paragraph takeaway, lifted
// from `post.description` into a prominent block before the body. Editorial Ink:
// NOT a colored plaque — a vermilion left hairline + mono overline carry the
// emphasis. Renders nothing when there is no description.

interface PostBlufProps {
  text?: string;
}

export function PostBluf({ text }: PostBlufProps) {
  const t = useTranslations("blog");

  if (!text || !text.trim()) return null;

  return (
    <Box
      sx={{
        my: 4,
        pl: 2.5,
        borderLeft: (theme) => `2px solid ${theme.vars.palette.primary.main}`,
      }}
    >
      <Box
        component="p"
        sx={{ ...monoLabelSx, m: 0, mb: 1, color: "primary.main" }}
      >
        {t("bluf")}
      </Box>
      <Typography
        sx={{ m: 0, fontSize: "1.125rem", fontWeight: 500, lineHeight: 1.5 }}
      >
        {text}
      </Typography>
    </Box>
  );
}
