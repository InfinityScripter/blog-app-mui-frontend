"use client";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";

import { DashboardContent } from "src/layouts/dashboard";
import {
  _ecommerceNewProducts,
  _ecommerceBestSalesman,
  _ecommerceSalesOverview,
  _ecommerceLatestProducts,
} from "src/_mock";

import { svgColorClasses } from "src/components/svg-color";

import { useMockedUser } from "src/auth/hooks";

import { AppWidget } from "../app-widget";
import { AppAreaInstalled } from "../app-area-installed";
import { AppWidgetSummary } from "../app-widget-summary";
import { AppCurrentDownload } from "../app-current-download";
import { EcommerceNewProducts } from "../../e-commerce/ecommerce-new-products";
import { EcommerceBestSalesman } from "../../e-commerce/ecommerce-best-salesman";
import { EcommerceSaleByGender } from "../../e-commerce/ecommerce-sale-by-gender";
import { EcommerceWidgetSummary } from "../../e-commerce/ecommerce-widget-summary";
import { EcommerceSalesOverview } from "../../e-commerce/ecommerce-sales-overview";
import { EcommerceCurrentBalance } from "../../e-commerce/ecommerce-current-balance";
import { EcommerceLatestProducts } from "../../e-commerce/ecommerce-latest-products";

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { user } = useMockedUser();

  const theme = useTheme();

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <EcommerceNewProducts list={_ecommerceNewProducts} />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title="Product sold"
            percent={2.6}
            total={765}
            chart={{
              categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
              ],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title="Total balance"
            percent={-0.1}
            total={18765}
            chart={{
              colors: [
                theme.vars.palette.warning.light,
                theme.vars.palette.warning.main,
              ],
              categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
              ],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title="Sales profit"
            percent={0.6}
            total={4876}
            chart={{
              colors: [
                theme.vars.palette.error.light,
                theme.vars.palette.error.main,
              ],
              categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
              ],
              series: [40, 70, 75, 70, 50, 28, 7, 64],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <EcommerceSaleByGender
            title="Sale by gender"
            total={2324}
            chart={{
              series: [
                { label: "Mens", value: 25 },
                { label: "Womens", value: 50 },
                { label: "Kids", value: 75 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <EcommerceSalesOverview
            title="Sales overview"
            data={_ecommerceSalesOverview}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <EcommerceCurrentBalance
            title="Current balance"
            earning={25500}
            refunded={1600}
            orderTotal={287650}
            currentBalance={187650}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <EcommerceBestSalesman
            title="Best salesman"
            tableData={_ecommerceBestSalesman}
            headLabel={[
              { id: "name", label: "Seller" },
              { id: "category", label: "Product" },
              { id: "country", label: "Country", align: "center" },
              { id: "totalAmount", label: "Total", align: "right" },
              { id: "rank", label: "Rank", align: "right" },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <EcommerceLatestProducts
            title="Latest products"
            list={_ecommerceLatestProducts}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Всего пользователей"
            percent={2.6}
            total={18765}
            chart={{
              categories: [
                "Январь",
                "Февраль",
                "Март",
                "Апрель",
                "Май",
                "Июнь",
                "Июль",
                "Август",
              ],
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
              categories: [
                "Январь",
                "Февраль",
                "Март",
                "Апрель",
                "Май",
                "Июнь",
                "Июль",
                "Август",
              ],
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
              categories: [
                "Январь",
                "Февраль",
                "Март",
                "Апрель",
                "Май",
                "Июнь",
                "Июль",
                "Август",
              ],
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
                { label: "Москва", value: 12244 },
                { label: "Санкт-Петербург", value: 53345 },
                { label: "Ростов", value: 44313 },
                { label: "Казань", value: 78343 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppAreaInstalled
            title="Обзор заказов"
            subheader="(+32%) чем в прошлом году"
            chart={{
              categories: [
                "Январь",
                "Февраль",
                "Март",
                "Апрель",
                "Май",
                "Июнь",
                "Июль",
                "Август",
                "Сентябрь",
                "Октябрь",
                "Ноябрь",
                "Декабрь",
              ],
              series: [
                {
                  name: "2022",
                  data: [
                    {
                      name: "Москва",
                      data: [12, 10, 18, 22, 20, 12, 8, 21, 20, 14, 15, 16],
                    },
                    {
                      name: "Санкт-Петербург",
                      data: [12, 10, 18, 22, 20, 12, 8, 21, 20, 14, 15, 16],
                    },
                    {
                      name: "Казань",
                      data: [12, 10, 18, 22, 20, 12, 8, 21, 20, 14, 15, 16],
                    },
                  ],
                },
                {
                  name: "2023",
                  data: [
                    {
                      name: "Москва",
                      data: [6, 18, 14, 9, 20, 6, 22, 19, 8, 22, 8, 17],
                    },
                    {
                      name: "Санкт-Петербург",
                      data: [6, 18, 14, 9, 20, 6, 22, 19, 8, 22, 8, 17],
                    },
                    {
                      name: "Казань",
                      data: [6, 18, 14, 9, 20, 6, 22, 19, 8, 22, 8, 17],
                    },
                  ],
                },
                {
                  name: "2024",
                  data: [
                    {
                      name: "Москва",
                      data: [6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10],
                    },
                    {
                      name: "Санкт-Петербург",
                      data: [6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10],
                    },
                    {
                      name: "Казань",
                      data: [6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
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
                colors: [
                  theme.vars.palette.info.light,
                  theme.vars.palette.info.main,
                ],
              }}
              sx={{
                bgcolor: "info.dark",
                [`& .${svgColorClasses.root}`]: { color: "info.light" },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
