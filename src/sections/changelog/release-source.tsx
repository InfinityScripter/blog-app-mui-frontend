import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

interface ReleaseSourceProps {
  sourceUrl: string;
  sourceName: string | null;
}

/** Attribution link to the original announcement (opens in a new tab). */
export function ReleaseSource({ sourceUrl, sourceName }: ReleaseSourceProps) {
  const t = useTranslations("changelog");

  if (!sourceUrl) return null;

  return (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
      <Iconify width={18} icon="solar:link-bold-duotone" />
      <Link
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        variant="body2"
      >
        {sourceName ?? t("source")}
      </Link>
    </Stack>
  );
}
