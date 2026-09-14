import Box from "@mui/material/Box";
import { useTranslations } from "next-intl";
import { Iconify } from "src/components/iconify";
import { fShortenNumber } from "src/utils/format-number";

// ----------------------------------------------------------------------

interface PostItemHorizontalStatsProps {
  readingTime: number;
  totalComments: number;
  totalViews: number;
  totalShares: number;
}

export function PostItemHorizontalStats({
  readingTime,
  totalComments,
  totalViews,
  totalShares,
}: PostItemHorizontalStatsProps) {
  const t = useTranslations("blog");

  const metricSx = {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
  } as const;

  return (
    <Box
      sx={{
        gap: 1.5,
        flexGrow: 1,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "flex-end",
        typography: "caption",
        color: "text.disabled",
      }}
    >
      <Box sx={metricSx}>
        <Iconify icon="solar:clock-circle-bold" width={16} />
        {t("readingTime", { minutes: readingTime })}
      </Box>

      <Box sx={metricSx}>
        <Iconify icon="eva:message-circle-fill" width={16} />
        {fShortenNumber(totalComments)}
      </Box>

      <Box sx={metricSx}>
        <Iconify icon="solar:eye-bold" width={16} />
        {fShortenNumber(totalViews)}
      </Box>

      <Box sx={metricSx}>
        <Iconify icon="solar:share-bold" width={16} />
        {fShortenNumber(totalShares)}
      </Box>
    </Box>
  );
}
