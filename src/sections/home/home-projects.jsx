import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { varFade, MotionViewport } from 'src/components/animate';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const PROJECTS = [
  {
    title: 'Blog Platform',
    description: 'A full-featured blog platform with markdown support, commenting system, and admin panel.',
    image: '/assets/images/projects/blog.jpg',
    link: 'https://github.com/InfinityScripter/blog-platform',
    tech: ['Next.js', 'Material UI', 'MongoDB'],
    features: [
      'User authentication',
      'Markdown editor',
      'Comments and likes',
      'Admin panel',
    ]
  },
  {
    title: 'E-commerce Dashboard',
    description: 'Admin dashboard for e-commerce with real-time analytics and order management.',
    image: '/assets/images/projects/dashboard.jpg',
    link: 'https://github.com/InfinityScripter/ecommerce-dashboard',
    tech: ['React', 'TypeScript', 'Node.js'],
    features: [
      'Real-time analytics',
      'Order management',
      'Payment system integration',
      'Multi-language support',
    ]
  },
  {
    title: 'Task Manager',
    description: 'Task management application with team collaboration support and integration with popular services.',
    image: '/assets/images/projects/tasks.jpg',
    link: 'https://github.com/InfinityScripter/task-manager',
    tech: ['Angular', 'Express', 'PostgreSQL'],
    features: [
      'Team workspaces',
      'Drag-and-drop interface',
      'Real-time notifications',
      'Calendar integration',
    ]
  }
];

export function HomeProjects() {
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
          <Typography variant="h2">Projects</Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography sx={{ color: 'text.secondary' }}>
            Some of my recent projects
          </Typography>
        </m.div>
      </Stack>

      <Box
        gap={4}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {PROJECTS.map((project) => (
          <m.div key={project.title} variants={varFade().inUp}>
            <Card
              sx={{
                textAlign: 'left',
                p: 3,
                height: 1,
              }}
            >
              {project.image && (
                <Box
                  component="img"
                  src={project.image}
                  alt={project.title}
                  sx={{
                    borderRadius: 1.5,
                    mb: 3,
                    width: 1,
                    height: 200,
                    objectFit: 'cover',
                  }}
                />
              )}

              <Stack spacing={2}>
                <Link
                  component={RouterLink}
                  href={project.link}
                  target="_blank"
                  sx={{ color: 'inherit', textDecoration: 'none' }}
                >
                  <Typography variant="h5" noWrap>
                    {project.title}
                  </Typography>
                </Link>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {project.description}
                </Typography>

                <Stack direction="row" flexWrap="wrap" spacing={1}>
                  {project.tech.map((tech) => (
                    <Typography
                      key={tech}
                      variant="caption"
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: 'action.selected',
                      }}
                    >
                      {tech}
                    </Typography>
                  ))}
                </Stack>

                <Stack spacing={1} sx={{ pt: 1 }}>
                  {project.features.map((feature) => (
                    <Stack
                      key={feature}
                      spacing={1}
                      direction="row"
                      alignItems="center"
                      sx={{ typography: 'body2' }}
                    >
                      <Iconify icon="eva:checkmark-fill" width={16} sx={{ color: 'primary.main' }} />
                      {feature}
                    </Stack>
                  ))}
                </Stack>

                <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                  <Button
                    component={Link}
                    href={project.link}
                    target="_blank"
                    rel="noopener"
                    size="small"
                    color="inherit"
                    variant="contained"
                    startIcon={<Iconify icon="eva:github-fill" />}
                  >
                    Code
                  </Button>

                  <Button
                    component={Link}
                    href={project.link}
                    target="_blank"
                    rel="noopener"
                    size="small"
                    variant="soft"
                    startIcon={<Iconify icon="eva:external-link-fill" />}
                  >
                    Demo
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </m.div>
        ))}
      </Box>
    </Container>
  );
}
