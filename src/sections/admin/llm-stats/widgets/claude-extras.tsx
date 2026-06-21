import type { LlmStats } from "src/sections/admin/llm-stats/types";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import LinearProgress from "@mui/material/LinearProgress";

export function ClaudeExtras({ stats }: { stats: LlmStats }) {
  const x = stats.claudeExtras;
  if (!x) return null;
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ p: 3, height: 1 }}>
          <CardHeader title="Кэш-хит (Claude Code)" sx={{ p: 0, mb: 2 }} />
          <LinearProgress
            variant="determinate"
            value={Math.round(x.cacheHitRatio * 100)}
          />
          <Typography variant="body2" sx={{ mt: 1 }}>
            {Math.round(x.cacheHitRatio * 100)}% · агентов: {x.agentEvents}
          </Typography>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ p: 3, height: 1 }}>
          <CardHeader title="Топ скиллы" sx={{ p: 0, mb: 2 }} />
          <Stack spacing={0.5}>
            {x.topSkills.map((s) => (
              <Typography key={s.name} variant="body2">
                {s.name} — {s.count}
              </Typography>
            ))}
          </Stack>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ p: 3, height: 1 }}>
          <CardHeader title="Топ MCP-тулы" sx={{ p: 0, mb: 2 }} />
          <Stack spacing={0.5}>
            {x.topMcpTools.map((s) => (
              <Typography key={s.name} variant="body2">
                {s.name} — {s.count}
              </Typography>
            ))}
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
