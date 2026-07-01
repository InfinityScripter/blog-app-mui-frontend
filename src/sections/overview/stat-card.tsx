import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";

// ----------------------------------------------------------------------

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  loading?: boolean;
}

export function StatCard({ label, value, icon, loading }: StatCardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 3,
        height: 1,
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          flexShrink: 0,
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          color: "primary.main",
        }}
      >
        <Iconify icon={icon} width={24} />
      </Stack>

      <Stack spacing={0.5} sx={{ minWidth: 0 }}>
        {loading ? (
          <Skeleton sx={{ width: 48, height: 32 }} />
        ) : (
          <Typography variant="h4">{value}</Typography>
        )}
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {label}
        </Typography>
      </Stack>
    </Card>
  );
}
