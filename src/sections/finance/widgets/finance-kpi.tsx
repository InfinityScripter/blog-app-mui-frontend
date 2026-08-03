import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

export function FinanceKpi({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card sx={{ p: 3, height: 1 }}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
      <Typography variant="h4" sx={{ my: 0.5 }}>
        {value}
      </Typography>
      {hint ? (
        <Typography variant="caption" sx={{ color: "text.disabled" }}>
          {hint}
        </Typography>
      ) : null}
    </Card>
  );
}
