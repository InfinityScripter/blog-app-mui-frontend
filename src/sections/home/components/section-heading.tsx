import { m } from "framer-motion";
import Stack from "@mui/material/Stack";
import { varFade } from "src/components/animate";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

interface SectionHeadingProps {
  overline?: string;
  title: string;
  subtitle?: string;
}

/** Consistent section header for the portfolio sections (skills / experience / projects). */
export function SectionHeading({
  overline,
  title,
  subtitle,
}: SectionHeadingProps) {
  return (
    <Stack spacing={1.5} sx={{ textAlign: "center", mb: { xs: 5, md: 8 } }}>
      {overline ? (
        <m.div variants={varFade().inDown}>
          <Typography
            variant="overline"
            sx={{ color: "primary.main", letterSpacing: 1.4 }}
          >
            {overline}
          </Typography>
        </m.div>
      ) : null}

      <m.div variants={varFade().inDown}>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      </m.div>

      {subtitle ? (
        <m.div variants={varFade().inDown}>
          <Typography
            sx={{ color: "text.secondary", maxWidth: 560, mx: "auto" }}
          >
            {subtitle}
          </Typography>
        </m.div>
      ) : null}
    </Stack>
  );
}
