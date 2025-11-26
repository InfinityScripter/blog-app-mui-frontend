import { useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";

import { fNumber, fPercent } from "src/utils/format-number";

import { CONFIG } from "src/config-global";
import { varAlpha, bgGradient } from "src/theme/styles";

import { SvgColor } from "src/components/svg-color";
import { Chart, useChart } from "src/components/chart";

// ----------------------------------------------------------------------

export function ProjectMobilizationWidget({
  title,
  subheader,
  data,
  color = "primary",
  sx,
  ...other
}) {
  const theme = useTheme();
  const [subproject, setSubproject] = useState("all");
  const [category, setCategory] = useState("all");

  const subprojects = useMemo(() => {
    const uniqueSubprojects = [...new Set(data.map((item) => item.subproject))];
    return ["all", ...uniqueSubprojects];
  }, [data]);

  const categories = ["all", "Персонал", "Техника"];

  const handleChangeSubproject = (event) => {
    setSubproject(event.target.value);
  };

  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };

  const filteredData = useMemo(() => {
    let result = [...data];

    if (subproject !== "all") {
      result = result.filter((item) => item.subproject === subproject);
    }

    if (category !== "all") {
      result = result.filter((item) => item.category === category);
    }

    return result;
  }, [data, subproject, category]);

  // Group data by date for chart
  const chartData = useMemo(() => {
    const dates = [...new Set(filteredData.map((item) => item.date))].sort();

    // Calculate totals for each date
    const planSeries = [];
    const factSeries = [];

    dates.forEach((date) => {
      const dateItems = filteredData.filter((item) => item.date === date);

      const datePlanTotal = dateItems.reduce((sum, item) => sum + item.plan, 0);
      const dateFactTotal = dateItems.reduce((sum, item) => sum + item.fact, 0);

      planSeries.push(datePlanTotal);
      factSeries.push(dateFactTotal);
    });

    // Format dates for display
    const formattedDates = dates.map((date) => {
      const [year, month, day] = date.split("-");
      return `${day}/${month}`;
    });

    return {
      categories: formattedDates,
      series: [
        {
          name: "План",
          data: planSeries,
        },
        {
          name: "Факт",
          data: factSeries,
        },
      ],
    };
  }, [filteredData]);

  // Calculate total plan and fact
  const { planTotal, factTotal, diffPercent } = useMemo(() => {
    const latestDate = [...new Set(filteredData.map((item) => item.date))]
      .sort()
      .pop();
    const latestData = filteredData.filter((item) => item.date === latestDate);

    return {
      planTotal: latestData.reduce((sum, item) => sum + item.plan, 0),
      factTotal: latestData.reduce((sum, item) => sum + item.fact, 0),
      diffPercent:
        ((latestData.reduce((sum, item) => sum + item.fact, 0) -
          latestData.reduce((sum, item) => sum + item.plan, 0)) /
          latestData.reduce((sum, item) => sum + item.plan, 0)) *
        100,
    };
  }, [filteredData]);

  const chartOptions = useChart({
    colors: [theme.palette.warning.main, theme.palette.primary.main],
    plotOptions: {
      bar: {
        columnWidth: "16%",
      },
    },
    fill: {
      type: "solid",
    },
    labels: chartData.categories,
    xaxis: {
      type: "category",
    },
    tooltip: {
      y: {
        formatter: (value) => fNumber(value),
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
  });

  return (
    <Card
      sx={{
        ...bgGradient({
          color: `135deg, ${varAlpha(theme.vars.palette[color].lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette[color].lightChannel, 0.48)}`,
        }),
        p: 3,
        boxShadow: "none",
        position: "relative",
        color: `${color}.darker`,
        backgroundColor: "common.white",
        ...sx,
      }}
      {...other}
    >
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ mb: 1, typography: "h4" }}>{title}</Box>
          {subheader && <Box sx={{ typography: "subtitle2" }}>{subheader}</Box>}
        </Box>

        <Box>
          <img
            alt="icon"
            src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-users.svg`}
            width={48}
            height={48}
          />
        </Box>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          select
          fullWidth
          label="Подпроект"
          value={subproject}
          onChange={handleChangeSubproject}
          SelectProps={{
            MenuProps: { PaperProps: { sx: { maxHeight: 220 } } },
          }}
        >
          {subprojects.map((option) => (
            <MenuItem key={option} value={option}>
              {option === "all" ? "Все подпроекты" : option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Категория"
          value={category}
          onChange={handleChangeCategory}
          SelectProps={{
            MenuProps: { PaperProps: { sx: { maxHeight: 220 } } },
          }}
        >
          {categories.map((option) => (
            <MenuItem key={option} value={option}>
              {option === "all" ? "Все категории" : option}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box>
          <Box sx={{ typography: "subtitle2", color: "text.secondary" }}>
            Всего (план)
          </Box>
          <Box sx={{ typography: "h3" }}>{fNumber(planTotal)}</Box>
        </Box>

        <Box>
          <Box sx={{ typography: "subtitle2", color: "text.secondary" }}>
            Всего (факт)
          </Box>
          <Box sx={{ typography: "h3" }}>{fNumber(factTotal)}</Box>
        </Box>

        <Box
          sx={{
            py: 0.5,
            px: 1,
            borderRadius: 1,
            typography: "subtitle2",
            bgcolor: diffPercent >= 0 ? "success.lighter" : "error.lighter",
            color: diffPercent >= 0 ? "success.darker" : "error.darker",
          }}
        >
          {diffPercent > 0 && "+"}
          {fPercent(diffPercent / 100)}
        </Box>
      </Box>

      <Chart
        type="bar"
        series={chartData.series}
        options={chartOptions}
        height={364}
      />

      <SvgColor
        src={`${CONFIG.site.basePath}/assets/background/shape-square.svg`}
        sx={{
          top: 0,
          left: -20,
          width: 240,
          zIndex: -1,
          height: 240,
          opacity: 0.24,
          position: "absolute",
          color: `${color}.main`,
        }}
      />
    </Card>
  );
}
