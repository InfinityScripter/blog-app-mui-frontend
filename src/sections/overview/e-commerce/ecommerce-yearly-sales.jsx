import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fShortenNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartSelect, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

export function EcommerceYearlySales({ title, subheader, chart, ...other }) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [theme.palette.primary.main, theme.palette.error.main];

  const chartOptions = useChart({
    colors: chartColors,
    xaxis: { categories: chart.categories },
    yaxis: {
      labels: {
        formatter: (value) => `${value.toFixed(1)}%`,
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value.toFixed(1)}%`,
      },
    },
    ...chart.options,
  });

  // Prepare data for display - both plan and fact simultaneously
  const seriesData = chart.series.map((item) => ({
    name: item.name,
    data: item.data[0].data,
  }));

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        sx={{ mb: 3 }}
      />

      <ChartLegends
        colors={chartOptions?.colors}
        labels={chart.series.map((item) => item.name)}
        values={chart.series.map((item) =>
          `${item.data[0].data[item.data[0].data.length - 1].toFixed(1)}%`
        )}
        sx={{ px: 3, gap: 3 }}
      />

      <Chart
        type="line"
        series={seriesData}
        options={chartOptions}
        height={320}
        loadingProps={{ sx: { p: 2.5 } }}
        sx={{ py: 2.5, pl: 1, pr: 2.5 }}
      />
    </Card>
  );
}
