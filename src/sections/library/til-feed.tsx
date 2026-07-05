import { useMemo } from "react";
import Box from "@mui/material/Box";
import { useTranslations } from "next-intl";
import Typography from "@mui/material/Typography";

import { TIL_ITEMS } from "./data";
import { TilCard } from "./til-card";
import { sortTilDesc } from "./utils";

// ----------------------------------------------------------------------

/** «TIL» tab: own micro-notes, newest first. Placeholder when empty. */
export function TilFeedSection() {
  const t = useTranslations("library");
  const items = useMemo(() => sortTilDesc(TIL_ITEMS), []);

  if (!items.length) {
    return (
      <Typography
        variant="body2"
        sx={{ py: 6, textAlign: "center", color: "text.disabled" }}
      >
        {t("til.empty")}
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 720 }}>
      {items.map((til) => (
        <TilCard key={til.id} til={til} />
      ))}
    </Box>
  );
}
