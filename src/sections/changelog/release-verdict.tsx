import Box from "@mui/material/Box";
import { useTranslations } from "next-intl";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

interface ReleaseVerdictProps {
  verdict: string | null;
}

/**
 * The owner's one-liner take. Bot drafts have no verdict (null) → renders
 * nothing. Uses the theme primary tint (never a hex) so it reads as a callout.
 */
export function ReleaseVerdict({ verdict }: ReleaseVerdictProps) {
  const t = useTranslations("changelog");

  if (!verdict) return null;

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
        borderLeft: (theme) => `4px solid ${theme.palette.primary.main}`,
      }}
    >
      <Typography
        variant="overline"
        sx={{ color: "primary.main", display: "block", mb: 0.5 }}
      >
        {t("verdict")}
      </Typography>
      <Typography variant="body1">{verdict}</Typography>
    </Box>
  );
}
