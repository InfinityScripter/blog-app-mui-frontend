import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';

import { fNumber, fPercent } from 'src/utils/format-number';

import { CONFIG } from 'src/config-global';
import { varAlpha, bgGradient } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export function ProjectMobilizationSummary({ data }) {
  const [subproject, setSubproject] = useState('all');
  const theme = useTheme();

  const subprojects = useMemo(() => {
    const uniqueSubprojects = [...new Set(data.map(item => item.subproject))];
    return ['all', ...uniqueSubprojects];
  }, [data]);

  const handleChangeSubproject = (event) => {
    setSubproject(event.target.value);
  };

  const filteredData = useMemo(() => {
    let result = [...data];

    if (subproject !== 'all') {
      result = result.filter(item => item.subproject === subproject);
    }

    return result;
  }, [data, subproject]);

  // Get latest date data
  const latestData = useMemo(() => {
    const latestDate = [...new Set(filteredData.map(item => item.date))].sort().pop();
    return filteredData.filter(item => item.date === latestDate);
  }, [filteredData]);

  // Calculate totals
  const totals = useMemo(() => {
    // Total for all categories
    const totalPlan = latestData.reduce((sum, item) => sum + item.plan, 0);
    const totalFact = latestData.reduce((sum, item) => sum + item.fact, 0);
    const totalPercent = ((totalFact - totalPlan) / totalPlan) * 100;

    // Personnel only
    const personnelData = latestData.filter(item => item.category === 'Персонал');
    const personnelPlan = personnelData.reduce((sum, item) => sum + item.plan, 0);
    const personnelFact = personnelData.reduce((sum, item) => sum + item.fact, 0);
    const personnelPercent = ((personnelFact - personnelPlan) / personnelPlan) * 100;

    // Equipment only
    const equipmentData = latestData.filter(item => item.category === 'Техника');
    const equipmentPlan = equipmentData.reduce((sum, item) => sum + item.plan, 0);
    const equipmentFact = equipmentData.reduce((sum, item) => sum + item.fact, 0);
    const equipmentPercent = ((equipmentFact - equipmentPlan) / equipmentPlan) * 100;

    return {
      total: { plan: totalPlan, fact: totalFact, percent: totalPercent },
      personnel: { plan: personnelPlan, fact: personnelFact, percent: personnelPercent },
      equipment: { plan: equipmentPlan, fact: equipmentFact, percent: equipmentPercent }
    };
  }, [latestData]);

  // Prepare chart data for each widget
  const getChartData = (category = null) => {
    const dates = [...new Set(filteredData.map(item => item.date))].sort();

    const formattedDates = dates.map(date => {
      const [year, month, day] = date.split('-');
      return `${day}/${month}`;
    });

    const series = dates.map(date => {
      const dateItems = filteredData.filter(item => item.date === date);

      let items = dateItems;
      if (category) {
        items = dateItems.filter(item => item.category === category);
      }

      return items.reduce((sum, item) => sum + item.fact, 0);
    });

    return {
      categories: formattedDates,
      series,
    };
  };

  const totalChartData = getChartData();
  const personnelChartData = getChartData('Персонал');
  const equipmentChartData = getChartData('Техника');

  return (
    <Box sx={{ pt: 3 }}>
      <TextField
        select
        label="Подпроект"
        value={subproject}
        onChange={handleChangeSubproject}
        sx={{ mb: 3, minWidth: 200 }}
        SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: 220 } } } }}
      >
        {subprojects.map((option) => (
          <MenuItem key={option} value={option}>
            {option === 'all' ? 'Все подпроекты' : option}
          </MenuItem>
        ))}
      </TextField>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <MobilizationWidget
            title="Общая мобилизация"
            total={totals.total.fact}
            percent={totals.total.percent}
            color="warning"
            icon={<img alt="icon" src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-buy.svg`} />}
            chart={totalChartData}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <MobilizationWidget
            title="Персонал"
            total={totals.personnel.fact}
            percent={totals.personnel.percent}
            color="secondary"
            icon={<img alt="icon" src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-users.svg`} />}
            chart={personnelChartData}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <MobilizationWidget
            title="Техника"
            total={totals.equipment.fact}
            percent={totals.equipment.percent}
            color="error"
            icon={<img alt="icon" src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-message.svg`} />}
            chart={equipmentChartData}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

ProjectMobilizationSummary.propTypes = {
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

// ----------------------------------------------------------------------

function MobilizationWidget({ title, total, percent, color = 'primary', icon, chart }) {
  const theme = useTheme();

  const chartColors = [theme.palette[color].main];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    xaxis: { categories: chart.categories },
    grid: {
      padding: {
        top: 6,
        left: 6,
        right: 6,
        bottom: 6,
      },
    },
    tooltip: {
      y: { formatter: (value) => fNumber(value), title: { formatter: () => '' } },
    },
  });

  const renderTrending = (
    <Box
      sx={{
        top: 16,
        gap: 0.5,
        right: 16,
        display: 'flex',
        position: 'absolute',
        alignItems: 'center',
      }}
    >
      <Iconify width={20} icon={percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'} />
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {percent > 0 && '+'}
        {fPercent(percent / 100)}
      </Box>
    </Box>
  );

  return (
    <Card
      sx={{
        ...bgGradient({
          color: `135deg, ${varAlpha(theme.vars.palette[color].lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette[color].lightChannel, 0.48)}`,
        }),
        p: 3,
        boxShadow: 'none',
        position: 'relative',
        color: `${color}.darker`,
        backgroundColor: 'common.white',
      }}
    >
      <Box sx={{ width: 48, height: 48, mb: 3 }}>{icon}</Box>

      {renderTrending}

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 112 }}>
          <Box sx={{ mb: 1, typography: 'subtitle2' }}>{title}</Box>
          <Box sx={{ typography: 'h4' }}>{fNumber(total)}</Box>
        </Box>

        <Chart
          type="line"
          series={[{ data: chart.series }]}
          options={chartOptions}
          width={84}
          height={56}
        />
      </Box>

      <SvgColor
        src={`${CONFIG.site.basePath}/assets/background/shape-square.svg`}
        sx={{
          top: 0,
          left: -20,
          width: 240,
          zIndex: -1,
          height: 240,
          opacity: 0.24,
          position: 'absolute',
          color: `${color}.main`,
        }}
      />
    </Card>
  );
}

MobilizationWidget.propTypes = {
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  percent: PropTypes.number.isRequired,
  color: PropTypes.string,
  icon: PropTypes.node.isRequired,
  chart: PropTypes.shape({
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    series: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
};
