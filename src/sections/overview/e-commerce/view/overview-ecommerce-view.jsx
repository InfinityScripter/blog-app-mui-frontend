'use client';

import {useTheme} from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import {DashboardContent} from 'src/layouts/dashboard';
import { projectTotalProgress } from 'src/data/project-data';

import {EcommerceYearlySales} from '../ecommerce-yearly-sales';
import {ProjectColumnNegative} from '../project-column-negative';

// ----------------------------------------------------------------------

export function OverviewEcommerceView() {

  const theme = useTheme();

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Отклонения от плана
          </Typography>
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <EcommerceYearlySales
            title="Общий прогресс"
            subheader="План vs Факт"
            chart={{
              categories: [
                '05.01',
                '12.01',
                '19.01',
                '26.01',
                '02.02',
                '09.02',
                '16.02',
                '23.02',
              ],
              series: [
                {
                  name: 'План',
                  data: [
                    {
                      name: 'Прогресс',
                      data: [50.67, 49.37, 50.07, 50.83, 50.86, 51.53, 52.36, 51.55],
                    },
                  ],
                },
                {
                  name: 'Факт',
                  data: [
                    {
                      name: 'Прогресс',
                      data: [46.83, 47.20, 47.81, 48.21, 48.86, 49.12, 49.71, 50.07],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <Card>
            <CardHeader title="Отклонение от плана по датам" subheader="Процент отклонения" />
            <ProjectColumnNegative
              chart={{
                categories: projectTotalProgress.map(item => item.date),
                series: [
                  {
                    name: 'Отклонение',
                    data: projectTotalProgress.map(item => ((item.fact - item.plan) * 100).toFixed(2)),
                  },
                ],
              }}
              rangeSettings={[
                {
                  from: -10,
                  to: -2,
                  color: theme.palette.error.main, // Значительное отставание
                },
                {
                  from: -2,
                  to: 0,
                  color: theme.palette.warning.main, // Небольшое отставание
                },
                {
                  from: 0,
                  to: 2,
                  color: theme.palette.info.main, // Небольшое опережение
                },
                {
                  from: 2,
                  to: 10,
                  color: theme.palette.success.main, // Значительное опережение
                },
              ]}
            />
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
