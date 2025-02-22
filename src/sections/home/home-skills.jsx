import PropTypes from 'prop-types';
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';

import { varFade, MotionViewport } from 'src/components/animate';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const SKILLS = [
  {
    name: 'Frontend Development',
    description: 'Creating modern and responsive web interfaces',
    icon: 'carbon:application-web',
    items: ['React', 'TypeScript', 'Next.js', 'Angular', 'Material UI', 'Tailwind CSS']
  },
  {
    name: 'Backend Development',
    description: 'Server-side development and API implementation',
    icon: 'carbon:server',
    items: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST API', 'GraphQL']
  },
  {
    name: 'Tools & DevOps',
    description: 'Development tools and deployment',
    icon: 'carbon:tools',
    items: ['Git', 'Docker', 'AWS', 'CI/CD', 'Jest', 'Cypress']
  }
];

export default function HomeSkills() {
  const theme = useTheme();

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 5, md: 10 },
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
          <Typography variant="h2">My Skills</Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography sx={{ color: 'text.secondary' }}>
            Professional skills and technologies I use in my work
          </Typography>
        </m.div>
      </Stack>

      <Box
        gap={4}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {SKILLS.map((skill) => (
          <m.div key={skill.name} variants={varFade().inUp}>
            <Paper
              sx={{
                p: 4,
                height: 1,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: theme.palette.background.neutral,
              }}
            >
              <Stack spacing={3} flexGrow={1}>
                <Iconify
                  icon={skill.icon}
                  width={32}
                  sx={{
                    color: 'primary.main',
                  }}
                />

                <Typography variant="h5">{skill.name}</Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {skill.description}
                </Typography>

                <Stack spacing={1} sx={{ pt: 3 }}>
                  {skill.items.map((item) => (
                    <Stack
                      key={item}
                      spacing={1}
                      direction="row"
                      alignItems="center"
                      sx={{
                        typography: 'body2',
                      }}
                    >
                      <Iconify icon="eva:checkmark-fill" width={16} sx={{ color: 'primary.main' }} />
                      {item}
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Paper>
          </m.div>
        ))}
      </Box>
    </Container>
  );
}
