import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { fDate } from "src/utils/format-time";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";

import type { TilItem } from "./types";

// ----------------------------------------------------------------------

interface TilCardProps {
  til: TilItem;
}

/** One TIL note: date, title, body, tag chips, and an optional source link. */
export function TilCard({ til }: TilCardProps) {
  return (
    <Card variant="outlined" sx={{ p: { xs: 2, md: 2.5 }, mb: 2 }}>
      <Typography variant="caption" sx={{ color: "text.disabled" }}>
        {fDate(til.date)}
      </Typography>
      <Typography variant="h6" sx={{ mt: 0.5, mb: 1 }}>
        {til.title}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {til.body}
      </Typography>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mt: 1.5, flexWrap: "wrap", gap: 1 }}
      >
        {til.tags.map((tag) => (
          <Chip key={tag} size="small" variant="outlined" label={`#${tag}`} />
        ))}
        {til.sourceUrl && (
          <Link
            href={til.sourceUrl}
            target="_blank"
            rel="noopener"
            variant="caption"
            underline="hover"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.25,
              ml: "auto",
            }}
          >
            Источник
            <Iconify width={14} icon="solar:arrow-right-up-linear" />
          </Link>
        )}
      </Stack>
    </Card>
  );
}
