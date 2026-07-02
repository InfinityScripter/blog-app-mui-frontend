import { m } from "framer-motion";
import Stack from "@mui/material/Stack";
import { monoLabelSx } from "src/theme/styles";
import { varFade } from "src/components/animate";
import Typography from "@mui/material/Typography";

import type { SectionHeadingProps } from "./types";

// ----------------------------------------------------------------------

/** Consistent section header (Editorial Ink): left-aligned, mono overline. */
export function SectionHeading({
  overline,
  title,
  subtitle,
}: SectionHeadingProps) {
  return (
    <Stack
      spacing={1.5}
      sx={{ alignItems: "flex-start", mb: { xs: 5, md: 8 } }}
    >
      {overline ? (
        <m.div variants={varFade().inDown}>
          <Typography component="p" sx={monoLabelSx}>
            {overline}
          </Typography>
        </m.div>
      ) : null}

      <m.div variants={varFade().inDown}>
        <Typography variant="h2" component="h2">
          {title}
        </Typography>
      </m.div>

      {subtitle ? (
        <m.div variants={varFade().inDown}>
          <Typography sx={{ color: "text.secondary", maxWidth: "65ch" }}>
            {subtitle}
          </Typography>
        </m.div>
      ) : null}
    </Stack>
  );
}
