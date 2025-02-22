import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineDot from '@mui/lab/TimelineDot';
import { useTheme } from '@mui/material/styles';

import { varFade, MotionViewport } from 'src/components/animate';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const EXPERIENCE = [
  {
    year: '2022 - Present',
    position: 'Senior Frontend Developer',
    company: 'Tech Solutions Inc.',
    location: 'Saint Petersburg, Russia',
    description: [
      'Lead developer in a team of 8 people',
      'Development and maintenance of high-load web applications',
      'Mentoring junior developers',
      'Implementation of best practices and coding standards',
    ],
  },
  {
    year: '2020 - 2022',
    position: 'Frontend Developer',
    company: 'Digital Innovations Ltd.',
    location: 'Moscow, Russia',
    description: [
      'Development of React applications for corporate clients',
      'Performance and UX optimization',
      'Integration with REST API and GraphQL',
      'Working in an agile team',
    ],
  },
  {
    year: '2018 - 2020',
    position: 'Junior Web Developer',
    company: 'StartUp Solutions',
    location: 'Yekaterinburg, Russia',
    description: [
      'User interface development',
      'Maintenance of existing projects',
      'Working with JavaScript and React',
      'Participation in code reviews',
    ],
  },
];

export default function HomeExperience() {
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
          <Typography variant="h2">Work Experience</Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography sx={{ color: 'text.secondary' }}>
            My professional journey in development
          </Typography>
        </m.div>
      </Stack>

      <Timeline position="alternate">
        {EXPERIENCE.map((item, index) => (
          <TimelineItem key={item.year}>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              {index !== EXPERIENCE.length - 1 && <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent>
              <m.div variants={varFade().inUp}>
                <Card sx={{ p: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 0.5, color: 'text.disabled', fontSize: 12 }}
                  >
                    {item.year}
                  </Typography>

                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {item.position}
                  </Typography>

                  <Stack spacing={0.5} sx={{ mb: 2 }}>
                    <Stack spacing={0.5} direction="row" alignItems="center">
                      <Iconify icon="eva:briefcase-fill" width={16} sx={{ color: 'primary.main' }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {item.company}
                      </Typography>
                    </Stack>

                    <Stack spacing={0.5} direction="row" alignItems="center">
                      <Iconify icon="eva:pin-fill" width={16} sx={{ color: 'primary.main' }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {item.location}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack spacing={1}>
                    {item.description.map((desc) => (
                      <Stack
                        key={desc}
                        spacing={1}
                        direction="row"
                        alignItems="flex-start"
                        sx={{ typography: 'body2' }}
                      >
                        <Iconify
                          icon="eva:checkmark-circle-2-fill"
                          width={16}
                          sx={{ color: 'primary.main', mt: 0.25 }}
                        />
                        {desc}
                      </Stack>
                    ))}
                  </Stack>
                </Card>
              </m.div>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Container>
  );
}
