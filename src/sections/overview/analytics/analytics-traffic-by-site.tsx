import type { ComponentType } from "react";
import type { CardProps } from "@mui/material/Card";
import type { Theme, SxProps } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { varAlpha } from "src/theme/styles";
import { useTheme } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { fShortenNumber } from "src/utils/format-number";
import { SocialIcon as RawSocialIcon } from "src/components/iconify";

// ----------------------------------------------------------------------

// `SocialIcon` is a shared `forwardRef` component without exported prop types;
// re-type it precisely at the call site (no runtime change) so it accepts
// `icon`/`width`/`sx` without resorting to `any`.
const SocialIcon = RawSocialIcon as unknown as ComponentType<{
  icon?: string;
  width?: number;
  sx?: SxProps<Theme>;
}>;

interface TrafficSite {
  label: string;
  value: string;
  total: number;
}

interface AnalyticsTrafficBySiteProps extends Omit<CardProps, "title"> {
  title?: React.ReactNode;
  subheader?: React.ReactNode;
  list: TrafficSite[];
}

export function AnalyticsTrafficBySite({
  title,
  subheader,
  list,
  ...other
}: AnalyticsTrafficBySiteProps) {
  const theme = useTheme();

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box
        display="grid"
        gap={2}
        gridTemplateColumns="repeat(2, 1fr)"
        sx={{ p: 3 }}
      >
        {list.map((site) => (
          <Box
            key={site.label}
            sx={{
              py: 2.5,
              display: "flex",
              borderRadius: 1.5,
              textAlign: "center",
              alignItems: "center",
              flexDirection: "column",
              border: `solid 1px ${varAlpha(theme.vars.palette.grey["500Channel"], 0.12)}`,
            }}
          >
            <SocialIcon width={32} icon={site.value} />

            <Typography variant="h6" sx={{ mt: 1 }}>
              {fShortenNumber(site.total)}
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {site.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
