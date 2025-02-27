import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function HomeAbout() {
  const theme = useTheme();

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 5, md: 10 },
      }}
    >
      <Grid container spacing={3} alignItems="center">
        {/* Left side - Image */}
        <Grid xs={12} md={6}>
          <m.div variants={varFade().inUp}>
            <Card
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: theme.customShadows.z24,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                component="img"
                src="/assets/images/about/developer.webp"
                alt="Developer"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 1,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 2,
                  bgcolor: alpha(theme.palette.background.default, 0.8),
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Typography variant="h5">Михаил Талалаев</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Web developer
                </Typography>
              </Box>
            </Card>
          </m.div>
        </Grid>

        {/* Right side - Content */}
        <Grid xs={12} md={6}>
          <m.div variants={varFade().inUp}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              Обо мне
            </Typography>

            <Typography
              sx={{
                color: 'text.secondary',
                mb: 3,
                typography: 'body1',
              }}
            >
              Опытный Frontend разработчик с более чем 13-летним опытом работы в IT и нефтегазовой отрасли.
              Специализируюсь на создании современных веб-интерфейсов с использованием React, Angular, TypeScript
              и других современных технологий.
            </Typography>

            <Typography
              sx={{
                color: 'text.secondary',
                mb: 3,
                typography: 'body1',
              }}
            >
              Имею опыт работы в таких компаниях как Яндекс, СТОМПЛАН, ShurikMarket и QCup, где успешно
              разрабатывал и оптимизировал веб-приложения, внедрял новые функциональности и улучшал
              пользовательский опыт.
            </Typography>

            <Typography
              sx={{
                color: 'text.secondary',
                mb: 4,
                typography: 'body1',
              }}
            >
              Готов решать сложные задачи, выходящие за рамки текущей специализации, и развиваться в направлении,
              где смогу принести максимальную пользу вашему бизнесу.
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button
                component={RouterLink}
                href={paths.contact}
                color="primary"
                variant="contained"
                endIcon={<Iconify icon="eva:arrow-forward-fill" />}
              >
                Связаться со мной
              </Button>
              <Button
                component="a"
                href="https://github.com/InfinityScripter"
                target="_blank"
                color="inherit"
                variant="outlined"
                startIcon={<Iconify icon="mdi:github" />}
              >
                GitHub
              </Button>
              <Button
                component="a"
                href="https://www.linkedin.com/in/talalaevs"
                target="_blank"
                color="info"
                variant="outlined"
                startIcon={<Iconify icon="mdi:linkedin" />}
              >
                LinkedIn
              </Button>
            </Stack>
          </m.div>
        </Grid>
      </Grid>
    </Container>
  );
}
