"use client";

import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";

import { DashboardContent } from "src/layouts/dashboard";
import {
  mobilizationData,
  projectTotalProgress,
  projectProgressBySubprojects,
} from "src/data/project-data";

import { EcommerceYearlySales } from "../ecommerce-yearly-sales";
import { ProjectColumnNegative } from "../project-column-negative";
import { ProjectMobilizationWidget } from "../project-mobilization-widget";
import { ProjectMobilizationSummary } from "../project-mobilization-summary";
import { ProjectMobilizationAnalysis } from "../project-mobilization-analysis";
import { ProjectProgressBySubprojects } from "../project-progress-by-subprojects";
import { ProjectColumnNegativeBySubprojects } from "../project-column-negative-by-subprojects";

// ----------------------------------------------------------------------

export function OverviewEcommerceView() {
  const theme = useTheme();

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Typography variant="h3" sx={{ mb: { xs: 1, md: 2 } }}>
            Газоперерабатывающий комплекс
          </Typography>
          <Typography variant="h5" sx={{ mb: { xs: 3, md: 5 } }}>
            В составе комплекса переработки этаносодержащего газа
          </Typography>
        </Grid>
        <Grid xs={12} md={12} lg={12}>
          <ProjectMobilizationSummary data={mobilizationData} />
        </Grid>
        <Grid xs={12} md={6} lg={6}>
          <EcommerceYearlySales
            title="Общий прогресс"
            subheader="План vs Факт"
            chart={{
              categories: [
                "05.01",
                "12.01",
                "19.01",
                "26.01",
                "02.02",
                "09.02",
                "16.02",
                "23.02",
              ],
              series: [
                {
                  name: "План",
                  data: [
                    {
                      name: "Прогресс",
                      data: [
                        50.67, 49.37, 50.07, 50.83, 50.86, 51.53, 52.36, 51.55,
                      ],
                    },
                  ],
                },
                {
                  name: "Факт",
                  data: [
                    {
                      name: "Прогресс",
                      data: [
                        46.83, 47.2, 47.81, 48.21, 48.86, 49.12, 49.71, 50.07,
                      ],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={6}>
          <ProjectProgressBySubprojects data={projectProgressBySubprojects} />
        </Grid>
        <Grid xs={12} md={6} lg={6}>
          <Card>
            <CardHeader
              title="Отклонение от плана Общий"
              subheader="Процент отклонения"
            />
            <ProjectColumnNegative
              chart={{
                categories: projectTotalProgress.map((item) => item.date),
                series: [
                  {
                    name: "Отклонение",
                    data: projectTotalProgress.map((item) =>
                      ((item.fact - item.plan) * 100).toFixed(2),
                    ),
                  },
                ],
              }}
              rangeSettings={[
                {
                  from: -20,
                  to: -10,
                  color: theme.palette.error.dark, // Значительное отставание
                },
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
                  color: theme.palette.success.light, // Небольшое опережение
                },
                {
                  from: 2,
                  to: 5,
                  color: theme.palette.success.main, // Опережение
                },
                {
                  from: 5,
                  to: 20,
                  color: theme.palette.success.dark, // Значительное опережение
                },
              ]}
            />
          </Card>
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <ProjectColumnNegativeBySubprojects
            data={projectProgressBySubprojects}
            rangeSettings={[
              {
                from: -20,
                to: -10,
                color: theme.palette.error.dark, // Значительное отставание
              },
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
                color: theme.palette.success.light, // Небольшое опережение
              },
              {
                from: 2,
                to: 5,
                color: theme.palette.success.main, // Опережение
              },
              {
                from: 5,
                to: 20,
                color: theme.palette.success.dark, // Значительное опережение
              },
            ]}
          />
        </Grid>

        <Grid xs={12}>
          <ProjectMobilizationWidget
            title="Мобилизация ресурсов"
            subheader="Динамика мобилизации персонала и техники"
            data={mobilizationData}
            color="info"
          />
        </Grid>

        <Grid xs={12}>
          <ProjectMobilizationAnalysis data={mobilizationData} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
