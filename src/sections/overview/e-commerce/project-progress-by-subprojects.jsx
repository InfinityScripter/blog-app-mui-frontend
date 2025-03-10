import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export function ProjectProgressBySubprojects({ data }) {
  const [subproject, setSubproject] = useState('all');
  const theme = useTheme();

  const subprojects = useMemo(() => 
    ['all', ...new Set(data.map(item => item.subproject))], 
  [data]);

  const filteredData = useMemo(() => {
    if (subproject === 'all') {
      return data.filter(item => item.discipline === 'Total');
    }
    return data.filter(item => item.subproject === subproject && item.discipline === 'Total');
  }, [data, subproject]);

  const chartData = useMemo(() => {
    const dates = [...new Set(filteredData.map(item => item.date))].sort();
    
    // Calculate totals for each date
    const planSeries = [];
    const factSeries = [];
    
    dates.forEach(date => {
      const dateItems = filteredData.filter(item => item.date === date);
      
      if (subproject === 'all') {
        // Calculate weighted average for all subprojects
        const totalPlan = dateItems.reduce((sum, item) => sum + item.plan, 0);
        const totalFact = dateItems.reduce((sum, item) => sum + item.fact, 0);
        
        const avgPlan = totalPlan / dateItems.length;
        const avgFact = totalFact / dateItems.length;
        
        planSeries.push(avgPlan * 100);
        factSeries.push(avgFact * 100);
      } else {
        // Get the single subproject data
        const item = dateItems[0];
        planSeries.push(item.plan * 100);
        factSeries.push(item.fact * 100);
      }
    });
    
    // Format dates for display
    const formattedDates = dates.map(date => {
      const [year, month, day] = date.split('-');
      return `${day}/${month}`;
    });
    
    return {
      categories: formattedDates,
      series: [
        {
          name: 'План',
          data: planSeries,
        },
        {
          name: 'Факт',
          data: factSeries,
        },
      ],
    };
  }, [filteredData, subproject]);

  const chartOptions = useChart({
    colors: [theme.palette.primary.main, theme.palette.error.main],
    stroke: {
      width: 2,
      curve: 'smooth',
    },
    fill: {
      type: 'gradient',
      opacity: 0.25,
    },
    xaxis: {
      categories: chartData.categories,
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        formatter: (value) => `${value.toFixed(1)}%`,
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value.toFixed(1)}%`,
      },
    },
  });

  return (
    <Card>
      <CardHeader
        title="Прогресс по подпроектам"
        subheader="Динамика прогресса по подпроектам"
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
                {option === 'all' ? 'Все подпроекты' : option}
              </MenuItem>
            ))}
          </TextField>
        }
      />

      <Box sx={{ mt: 3, mx: 3 }}>
        <Chart
          type="area"
          series={chartData.series}
          options={chartOptions}
          height={364}
        />
      </Box>
    </Card>
  );
}

ProjectProgressBySubprojects.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      subproject: PropTypes.string.isRequired,
      discipline: PropTypes.string.isRequired,
      plan: PropTypes.number.isRequired,
      fact: PropTypes.number.isRequired,
    })
  ).isRequired,
};
