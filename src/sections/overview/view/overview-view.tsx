"use client";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import Button from "@mui/material/Button";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";
import { DashboardContent } from "src/layouts/dashboard";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

import { StatsGrid } from "../stats-grid";
import { useOverviewStats } from "../hooks/use-overview-stats";

// ----------------------------------------------------------------------

export function OverviewView() {
  const { userName, stats, statsLoading, hasPosts } = useOverviewStats();

  const subheading =
    !statsLoading && !hasPosts
      ? "У вас пока нет постов — самое время начать!"
      : "Здесь вы можете создавать и вести свои посты.";

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={userName ? `Привет, ${userName}!` : "Привет!"}
        links={[{ name: "Главная", href: paths.dashboard.root }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card
        sx={{
          p: { xs: 3, md: 5 },
          mb: { xs: 3, md: 5 },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h5">{subheading}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Делитесь мыслями, публикуйте статьи и следите за тем, как их
            читают.
          </Typography>
        </Stack>

        <Button
          component={RouterLink}
          href={paths.dashboard.post.new}
          variant="contained"
          size="large"
          startIcon={<Iconify icon="mingcute:add-line" />}
          sx={{ flexShrink: 0 }}
        >
          Создать пост
        </Button>
      </Card>

      <StatsGrid stats={stats} loading={statsLoading} />
    </DashboardContent>
  );
}
