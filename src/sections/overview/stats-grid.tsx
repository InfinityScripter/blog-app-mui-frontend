import Grid from "@mui/material/Grid";

import { StatCard } from "./stat-card";
import { OVERVIEW_STAT_CARDS } from "./const";

import type { UserPostStats } from "./types";

// ----------------------------------------------------------------------

interface StatsGridProps {
  stats: UserPostStats;
  loading: boolean;
}

export function StatsGrid({ stats, loading }: StatsGridProps) {
  return (
    <Grid container spacing={3}>
      {OVERVIEW_STAT_CARDS.map((card) => (
        <Grid key={card.key} size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label={card.label}
            value={stats[card.key]}
            icon={card.icon}
            loading={loading}
          />
        </Grid>
      ))}
    </Grid>
  );
}
