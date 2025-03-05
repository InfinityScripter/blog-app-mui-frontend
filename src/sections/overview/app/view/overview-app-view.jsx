'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { svgColorClasses } from 'src/components/svg-color';

import { useMockedUser } from 'src/auth/hooks';

import { AppWidget } from '../app-widget';
import { AppWelcome } from '../app-welcome';
import { AppFeatured } from '../app-featured';
import { AppNewInvoice } from '../app-new-invoice';
import { AppTopAuthors } from '../app-top-authors';
import { AppTopRelated } from '../app-top-related';
import { AppAreaInstalled } from '../app-area-installed';
import { AppWidgetSummary } from '../app-widget-summary';
import { AppCurrentDownload } from '../app-current-download';
import { AppTopInstalledCountries } from '../app-top-installed-countries';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { user } = useMockedUser();

  const theme = useTheme();

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>




        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Всего пользователей"
            percent={2.6}
            total={18765}
            chart={{
              categories: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август'],
              series: [15, 18, 12, 51, 68, 11, 39, 37],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Всего устройств"
            percent={0.2}
            total={4876}
            chart={{
              colors: [theme.vars.palette.info.main],
              categories: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август'],
              series: [20, 41, 63, 33, 28, 35, 50, 46],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Всего заказов"
            percent={-0.1}
            total={678}
            chart={{
              colors: [theme.vars.palette.error.main],
              categories:  ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август'],
              series: [18, 19, 31, 8, 16, 37, 12, 33],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentDownload
            title="Текущие заказы"
            subheader="От сегодня"
            chart={{
              series: [
                { label: 'Москва', value: 12244 },
                { label: 'Санкт-Петербург', value: 53345 },
                { label: 'Ростов', value: 44313 },
                { label: 'Казань', value: 78343 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppAreaInstalled
            title="Обзор заказов"
            subheader="(+32%) чем в прошлом году"
            chart={{
              categories: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
              series: [
                {
                  name: '2022',
                  data: [
                    { name: 'Москва', data: [12, 10, 18, 22, 20, 12, 8, 21, 20, 14, 15, 16] },
                    { name: 'Санкт-Петербург', data: [12, 10, 18, 22, 20, 12, 8, 21, 20, 14, 15, 16] },
                    { name: 'Казань', data: [12, 10, 18, 22, 20, 12, 8, 21, 20, 14, 15, 16] },
                  ],
                },
                {
                  name: '2023',
                  data: [
                    { name: 'Москва', data: [6, 18, 14, 9, 20, 6, 22, 19, 8, 22, 8, 17] },
                    { name: 'Санкт-Петербург', data: [6, 18, 14, 9, 20, 6, 22, 19, 8, 22, 8, 17] },
                    { name: 'Казань', data: [6, 18, 14, 9, 20, 6, 22, 19, 8, 22, 8, 17] },
                  ],
                },
                {
                  name: '2024',
                  data: [
                    { name: 'Москва', data: [6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10] },
                    { name: 'Санкт-Петербург', data: [6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10] },
                    { name: 'Казань', data: [6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10] },
                  ],
                },
              ],
            }}
          />
        </Grid>



        <Grid xs={12} md={6} lg={4}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <AppWidget
              title="Клиенты"
              total={38566}
              icon="solar:user-rounded-bold"
              chart={{ series: 48 }}
            />

            <AppWidget
              title="Конверсия"
              total={55566}
              icon="fluent:mail-24-filled"
              chart={{
                series: 75,
                colors: [theme.vars.palette.info.light, theme.vars.palette.info.main],
              }}
              sx={{ bgcolor: 'info.dark', [`& .${svgColorClasses.root}`]: { color: 'info.light' } }}
            />
          </Box>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
