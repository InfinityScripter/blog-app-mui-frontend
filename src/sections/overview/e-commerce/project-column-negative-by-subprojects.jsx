import PropTypes from "prop-types";
import { useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";

import { Chart, useChart } from "src/components/chart";

// ----------------------------------------------------------------------

export function ProjectColumnNegativeBySubprojects({ data, rangeSettings }) {
  const [subproject, setSubproject] = useState("all");
  const theme = useTheme();

  const subprojects = useMemo(
    () => ["all", ...new Set(data.map((item) => item.subproject))],
    [data],
  );

  const filteredData = useMemo(() => {
    if (subproject === "all") {
      return data.filter((item) => item.discipline === "Total");
    }
    return data.filter(
      (item) => item.subproject === subproject && item.discipline === "Total",
    );
  }, [data, subproject]);

  const chartData = useMemo(() => {
    const dates = [...new Set(filteredData.map((item) => item.date))].sort();

    // Format dates for display
    const formattedDates = dates.map((date) => {
      const [year, month, day] = date.split("-");
      return `${day}/${month}`;
    });

    // Calculate deviation percentages
    const deviations = dates.map((date) => {
      const dateItems = filteredData.filter((item) => item.date === date);

      if (subproject === "all") {
        // Calculate average deviation for all subprojects
        const totalDeviation = dateItems.reduce(
          (sum, item) => sum + (item.fact - item.plan) * 100,
          0,
        );

        return parseFloat((totalDeviation / dateItems.length).toFixed(2));
      }

      // Get the single subproject deviation
      const item = dateItems[0];
      return parseFloat(((item.fact - item.plan) * 100).toFixed(2));
    });

    return {
      categories: formattedDates,
      series: [
        {
          name: "Отклонение",
          data: deviations,
        },
      ],
    };
  }, [filteredData, subproject]);

  const chartOptions = useChart({
    colors: theme.palette.primary.main,
    stroke: {
      show: false,
    },
    xaxis: {
      categories: chartData.categories,
    },
    yaxis: {
      min: -10,
      max: 5,
      labels: {
        formatter: (value) => `${value}%`,
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value}%`,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "55%",
        borderRadius: 2,
        dataLabels: {
          position: "top",
        },
        distributed: true,
        colors: {
          ranges: rangeSettings,
        },
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      customLegendItems: [
        "(-20% до -10%)",
        "(-10% до -2%)",
        "(-2% до 0%)",
        "(0% до 2%)",
        "(2% до 5%)",
      ],
      markers: {
        fillColors: [
          theme.palette.error.dark,
          theme.palette.error.light,
          theme.palette.warning.main,
          theme.palette.success.light,
          theme.palette.success.main,
        ],
      },
    },
  });

  return (
    <Card>
      <CardHeader
        title="Отклонение от плана по подпроектам"
        subheader="Процент отклонения"
        action={
          <TextField
            select
            size="small"
            value={subproject}
            onChange={(e) => setSubproject(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            {subprojects.map((option) => (
              <MenuItem key={option} value={option}>
                {option === "all" ? "Все подпроекты" : option}
              </MenuItem>
            ))}
          </TextField>
        }
      />

      <Box sx={{ mx: 3 }}>
        <Chart
          type="bar"
          series={chartData.series}
          options={chartOptions}
          height={364}
        />
      </Box>
    </Card>
  );
}

ProjectColumnNegativeBySubprojects.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      subproject: PropTypes.string.isRequired,
      discipline: PropTypes.string.isRequired,
      plan: PropTypes.number.isRequired,
      fact: PropTypes.number.isRequired,
    }),
  ).isRequired,
  rangeSettings: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.number.isRequired,
      to: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    }),
  ),
};
