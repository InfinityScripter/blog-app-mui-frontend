import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";

import { pricingColor, pricingLabelKey, toolCategoryLabelKey } from "./utils";

import type { ToolItem } from "./types";

// ----------------------------------------------------------------------

interface ToolCardProps {
  tool: ToolItem;
}

/** One tool card: name → external link, category + pricing labels, «для чего». */
export function ToolCard({ tool }: ToolCardProps) {
  const t = useTranslations("library");

  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: (theme) => theme.transitions.create("border-color"),
        "&:hover": { borderColor: "text.primary" },
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <Link
          href={tool.url}
          target="_blank"
          rel="noopener"
          color="inherit"
          underline="hover"
          sx={{
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          {tool.name}
          <Iconify width={14} icon="solar:arrow-right-up-linear" />
        </Link>
        <Label variant="soft" color={pricingColor(tool.pricing)}>
          {t(pricingLabelKey(tool.pricing))}
        </Label>
      </Stack>

      <Typography variant="caption" sx={{ color: "text.disabled", mb: 1 }}>
        {t(toolCategoryLabelKey(tool.category))}
      </Typography>

      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {tool.what}
      </Typography>
    </Card>
  );
}
