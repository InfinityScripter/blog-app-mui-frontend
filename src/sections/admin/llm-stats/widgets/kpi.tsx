import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <Card sx={{ p: 3, height: 1 }}>
      <Stack spacing={0.5}>
        <Typography
          variant="h4"
          sx={{ fontSize: { xs: 20, sm: 22, lg: 26 }, lineHeight: 1.2 }}
        >
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {label}
        </Typography>
      </Stack>
    </Card>
  );
}
