import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { fNumber, fPercent } from 'src/utils/format-number';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export function ProjectMobilizationAnalysis({ data }) {
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('all');
  const theme = useTheme();

  const dates = useMemo(() => [...new Set(data.map(item => item.date))].sort(), [data]);

  const categories = ['all', 'Персонал', 'Техника'];

  // Set default date to latest date
  useMemo(() => {
    if (dates.length && !date) {
      setDate(dates[dates.length - 1]);
    }
  }, [dates, date]);

  const handleChangeDate = (event) => {
    setDate(event.target.value);
  };

  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };

  const filteredData = useMemo(() => {
    if (!date) return [];

    let result = data.filter(item => item.date === date);

    if (category !== 'all') {
      result = result.filter(item => item.category === category);
    }

    return result;
  }, [data, date, category]);

  // Group data by subproject
  const subprojectData = useMemo(() => {
    const result = {};

    filteredData.forEach(item => {
      if (!result[item.subproject]) {
        result[item.subproject] = [];
      }
      result[item.subproject].push(item);
    });

    return result;
  }, [filteredData]);

  // Calculate totals
  const totals = useMemo(() => {
    const totalPlan = filteredData.reduce((sum, item) => sum + item.plan, 0);
    const totalFact = filteredData.reduce((sum, item) => sum + item.fact, 0);
    const percentComplete = totalPlan ? (totalFact / totalPlan) * 100 : 0;

    return { plan: totalPlan, fact: totalFact, percent: percentComplete };
  }, [filteredData]);

  // Prepare chart data
  const chartData = useMemo(() => {
    const subprojects = Object.keys(subprojectData);

    const planData = [];
    const factData = [];

    subprojects.forEach(subproject => {
      const items = subprojectData[subproject];
      const planTotal = items.reduce((sum, item) => sum + item.plan, 0);
      const factTotal = items.reduce((sum, item) => sum + item.fact, 0);

      planData.push(planTotal);
      factData.push(factTotal);
    });

    return {
      categories: subprojects,
      series: [
        { name: 'План', data: planData },
        { name: 'Факт', data: factData },
      ],
    };
  }, [subprojectData]);

  const chartOptions = useChart({
    colors: [theme.palette.warning.main, theme.palette.primary.main],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '40%',
        borderRadius: 2,
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: chartData.categories,
    },
    tooltip: {
      y: {
        formatter: (value) => fNumber(value),
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  return (
    <Card>
      <CardHeader
        title="Анализ мобилизации"
        action={
          <Stack direction="row" spacing={2}>
            <TextField
              select
              label="Дата"
              value={date}
              onChange={handleChangeDate}
              sx={{ minWidth: 180 }}
              SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: 220 } } } }}
            >
              {dates.map((option) => (
                <MenuItem key={option} value={option}>
                  {formatDate(option)}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Категория"
              value={category}
              onChange={handleChangeCategory}
              sx={{ minWidth: 180 }}
              SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: 220 } } } }}
            >
              {categories.map((option) => (
                <MenuItem key={option} value={option}>
                  {option === 'all' ? 'Все категории' : option}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        }
      />

      <Box sx={{ p: 3 }}>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
          sx={{ mb: 3 }}
        >
          <Stack spacing={1} sx={{ width: 1, textAlign: 'center' }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              План
            </Typography>
            <Typography variant="h4">{fNumber(totals.plan)}</Typography>
          </Stack>

          <Stack spacing={1} sx={{ width: 1, textAlign: 'center' }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Факт
            </Typography>
            <Typography variant="h4">{fNumber(totals.fact)}</Typography>
          </Stack>

          <Stack spacing={1} sx={{ width: 1, textAlign: 'center' }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Выполнение %
            </Typography>
            <Typography variant="h4">{fPercent(totals.percent )}</Typography>
          </Stack>
        </Stack>

        <Chart
          type="bar"
          series={chartData.series}
          options={chartOptions}
          height={360}
        />

        <TableContainer sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Подпроект</TableCell>
                <TableCell>Категория</TableCell>
                <TableCell align="right">План</TableCell>
                <TableCell align="right">Факт</TableCell>
                <TableCell align="right">Разница</TableCell>
                <TableCell align="right">Выполнение %</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => {
                const { subproject, category: rowCategory, plan, fact } = row;
                const diff = fact - plan;
                const percentComplete = plan ? (fact / plan) * 100 : 0;

                return (
                  <TableRow key={index}>
                    <TableCell>{subproject}</TableCell>
                    <TableCell>{rowCategory}</TableCell>
                    <TableCell align="right">{fNumber(plan)}</TableCell>
                    <TableCell align="right">{fNumber(fact)}</TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: diff >= 0 ? 'success.main' : 'error.main',
                      }}
                    >
                      {diff > 0 && '+'}
                      {fNumber(diff)}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
                        <Box
                          sx={{
                            width: 120,
                            height: 8,
                            borderRadius: 1,
                            bgcolor: alpha(theme.palette.grey[500], 0.16),
                          }}
                        >
                          <Box
                            sx={{
                              width: `${Math.min(percentComplete, 100)}%`,
                              height: '100%',
                              borderRadius: 1,
                              bgcolor: percentComplete >= 100
                                ? 'success.main'
                                : percentComplete >= 80
                                  ? 'warning.main'
                                  : 'error.main',
                            }}
                          />
                        </Box>
                        <Typography variant="body2">{fPercent(percentComplete )}</Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Card>
  );
}

ProjectMobilizationAnalysis.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      subproject: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      plan: PropTypes.number.isRequired,
      fact: PropTypes.number.isRequired,
    })
  ).isRequired,
};
