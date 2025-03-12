import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const CONTACT_INFO = [
  {
    icon: 'eva:phone-fill',
    label: 'Телефон',
    value: '+7 (922) 248-3750',
  },
  {
    icon: 'eva:email-fill',
    label: 'Email',
    value: 'talalaev.misha@gmail.com',
  },
  {
    icon: 'eva:pin-fill',
    label: 'Местоположение',
    value: 'Санкт-Петербург, Россия',
  },
];

export default function HomeContact() {
  const theme = useTheme();

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 5, md: 10 },
        bgcolor: theme.palette.background.neutral,
      }}
    >
      <Stack
        spacing={3}
        sx={{
          textAlign: 'center',
          mb: { xs: 5, md: 10 },
        }}
      >
        <m.div variants={varFade().inDown}>
          <Typography variant="h2">Связаться со мной</Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography sx={{ color: 'text.secondary' }}>
            Готов обсудить ваш проект или вакансию
          </Typography>
        </m.div>
      </Stack>

      <Grid container spacing={3}>
        {/* Contact Form */}
        <Grid xs={12} md={7}>
          <m.div variants={varFade().inUp}>
            <Card sx={{ boxShadow: theme.customShadows.z24 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" sx={{ mb: 4 }}>
                  Отправить сообщение
                </Typography>

                <Stack spacing={3}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField fullWidth label="Имя" />
                    <TextField fullWidth label="Email" />
                  </Stack>

                  <TextField fullWidth label="Тема" />

                  <TextField
                    fullWidth
                    label="Сообщение"
                    multiline
                    rows={4}
                  />

                  <Box sx={{ textAlign: 'right' }}>
                    <Button size="large" variant="contained" color="primary">
                      Отправить
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </m.div>
        </Grid>

        {/* Contact Info */}
        <Grid xs={12} md={5}>
          <Stack spacing={3}>
            {CONTACT_INFO.map((info) => (
              <m.div key={info.label} variants={varFade().inUp}>
                <Card
                  sx={{
                    boxShadow: theme.customShadows.z8,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.customShadows.z24,
                    },
                  }}
                >
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: '50%',
                          bgcolor: theme.palette.primary.lighter,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Iconify
                          icon={info.icon}
                          width={24}
                          sx={{ color: theme.palette.primary.main }}
                        />
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          {info.label}
                        </Typography>
                        <Typography variant="h6">{info.value}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </m.div>
            ))}

            <m.div variants={varFade().inUp}>
              <Card
                sx={{
                  boxShadow: theme.customShadows.z8,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.customShadows.z24,
                  },
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 2 }}>
                    Социальные сети
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    <Button
                      component="a"
                      href="https://github.com/InfinityScripter"
                      target="_blank"
                      variant="outlined"
                      color="inherit"
                      size="large"
                      sx={{ minWidth: 'auto', p: 1.25 }}
                    >
                      <Iconify icon="mdi:github" width={24} />
                    </Button>

                    <Button
                      component="a"
                      href="https://www.linkedin.com/in/talalaevs"
                      target="_blank"
                      variant="outlined"
                      color="info"
                      size="large"
                      sx={{ minWidth: 'auto', p: 1.25 }}
                    >
                      <Iconify icon="mdi:linkedin" width={24} />
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </m.div>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
