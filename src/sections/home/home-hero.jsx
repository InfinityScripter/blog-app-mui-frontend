import { useRef, useState } from 'react';
import { m, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useResponsive } from 'src/hooks/use-responsive';

import { textGradient } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionContainer } from 'src/components/animate';

import { HeroBackground } from './components/hero-background';

// Функции-хелперы остаются без изменений
function MInview({ children, component = m.div }) {
  return (
    <Box component={component} variants={varFade({ distance: 24 }).inUp}>
      {children}
    </Box>
  );
}

function useTransformY(value, distance) {
  const physics = {
    mass: 0.1,
    damping: 20,
    stiffness: 300,
    restDelta: 0.001,
  };

  return useSpring(useTransform(value, [0, 1], [0, distance]), physics);
}

function useScrollPercent() {
  const elementRef = useRef(null);
  const { scrollY } = useScroll();
  const [percent, setPercent] = useState(0);

  useMotionValueEvent(scrollY, 'change', (scrollHeight) => {
    let heroHeight = 0;
    if (elementRef.current) {
      heroHeight = elementRef.current.offsetHeight;
    }
    const scrollPercent = Math.floor((scrollHeight / heroHeight) * 100);
    setPercent(scrollPercent >= 100 ? 100 : Math.floor(scrollPercent));
  });

  return { elementRef, percent, scrollY };
}

const smKey = 'sm';
const mdKey = 'md';
const lgKey = 'lg';

// Данные обо мне
const myName = 'Mikhail Talalaev';
const myTitle = 'Web Developer';
const mySummary =
  'Love developing modern web applications using JavaScript and TypeScript. ' +
  'Specializing in React and Angular.' +
  'Passionate about clean code, responsive design, and user experience.';


const techIcons = [
  'logos:javascript',
  'logos:typescript-icon',
  'logos:react',
  'logos:angular-icon',
  'logos:html-5',
  'logos:css-3',
  'logos:tailwindcss-icon',
  'logos:material-ui',
  'logos:nodejs-icon',
  'logos:express',
  'logos:mariadb',
  'logos:mongodb',
  'logos:github-icon',
  'logos:git-icon',
  'logos:visual-studio-code',
  'logos:postman-icon',
  'logos:figma',
  'logos:docker',
  'logos:vercel',
];

export function HomeHero({ sx, ...other }) {
  const theme = useTheme();
  const scroll = useScrollPercent();
  const mdUp = useResponsive('up', mdKey);
  const distance = mdUp ? scroll.percent : 0;

  const y1 = useTransformY(scroll.scrollY, distance * -7);
  const y2 = useTransformY(scroll.scrollY, distance * -6);
  const y3 = useTransformY(scroll.scrollY, distance * -5);
  const y4 = useTransformY(scroll.scrollY, distance * -4);
  const y5 = useTransformY(scroll.scrollY, distance * -3);

  const opacity = useTransform(
    scroll.scrollY,
    [0, 1],
    [1, mdUp ? Number((1 - scroll.percent / 100).toFixed(1)) : 1]
  );

  // Новая версия заголовка с персональными данными
  const renderHeading = (
    <MInview>
      <Box
        component="h1"
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        sx={{
          ...theme.typography.h2,
          my: 0,
          mx: 'auto',
          maxWidth: 680,
          fontFamily: theme.typography.fontSecondaryFamily,
          [theme.breakpoints.up(lgKey)]: { fontSize: 64, lineHeight: '90px' },
        }}
      >
        <Box component="span" sx={{ width: 1, opacity: 0.24, mr: 1 }}>
          Development Blog
        </Box>
        <Box
          component={m.span}
          animate={{ backgroundPosition: '200% center' }}
          transition={{
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          sx={{
            ...textGradient(
              `300deg, ${theme.vars.palette.primary.main} 0%, ${theme.vars.palette.warning.main} 25%, ${theme.vars.palette.primary.main} 50%, ${theme.vars.palette.warning.main} 75%, ${theme.vars.palette.primary.main} 100%`
            ),
            backgroundSize: '400%',
            ml: { xs: 0.75, md: 1, xl: 1.5 },
          }}
        >
          {myName}
        </Box>
      </Box>
      <Box component="h2" sx={{ mt: 1, textAlign: 'center', ...theme.typography.h5 }}>
        {myTitle}
      </Box>
    </MInview>
  );

  // Новое описание с краткой информацией обо мне
  const renderText = (
    <MInview>
      <Typography
        variant="body2"
        sx={{
          mx: 'auto',
          [theme.breakpoints.up(smKey)]: { whiteSpace: 'pre-line' },
          [theme.breakpoints.up(lgKey)]: { fontSize: 20, lineHeight: '36px' },
        }}
      >
        {mySummary}
      </Typography>
    </MInview>
  );

  // Опыт работы
  const renderExperience = (
    <MInview>
      <Box
        gap={1.5}
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ typography: 'subtitle2' }}
      >
        <Iconify icon="mdi:clock-outline" width={24} />
        <Box component="span">3 years of experience</Box>
      </Box>
    </MInview>
  );

  // Кнопки для перехода к портфолио и контактам
  const renderButtons = (
    <Box display="flex" flexWrap="wrap" justifyContent="center" gap={{ xs: 1.5, sm: 2 }}>
      <MInview>
        <Stack alignItems="center" spacing={2.5}>
          <Button
            component={Link}
            href="https://github.com/InfinityScripter"
            target="_blank"
            rel="noopener"
            color="inherit"
            size="large"
            variant="contained"
            startIcon={<Iconify width={24} icon="akar-icons:github-fill" />}
          >
            Portfolio
          </Button>
          <Button
            component={Link}
            href="t.me/Sh0ny"
            color="inherit"
            size="large"
            variant="outlined"
            startIcon={<Iconify width={24} icon="akar-icons:telegram-fill" />}
          >
            Contact
          </Button>
        </Stack>
      </MInview>
    </Box>
  );

  // Технологии, которыми я владею
  const renderTechIcons = (
    <Stack spacing={2.5} direction="row">
      {techIcons.map((icon) => (
        <MInview key={icon}>
          <Iconify icon={icon} width={24} />
        </MInview>
      ))}
    </Stack>
  );

  const renderTech = (
    <Stack spacing={3} sx={{ textAlign: 'center' }}>
      <MInview>
        <Typography variant="overline" sx={{ opacity: 0.4 }}>
          Technologies:
        </Typography>
      </MInview>
      {renderTechIcons}
    </Stack>
  );

  return (
    <Stack
      ref={scroll.elementRef}
      component="section"
      sx={{
        overflow: 'hidden',
        position: 'relative',
        [theme.breakpoints.up(mdKey)]: {
          minHeight: 760,
          height: '100vh',
          maxHeight: 1440,
          display: 'block',
          willChange: 'opacity',
          mt: 'calc(var(--layout-header-desktop-height) * -1)',
        },
        ...sx,
      }}
      {...other}
    >
      <Box
        component={m.div}
        style={{ opacity }}
        sx={{
          width: 1,
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          transition: theme.transitions.create(['opacity']),
          [theme.breakpoints.up(mdKey)]: {
            height: 1,
            position: 'fixed',
            maxHeight: 'inherit',
          },
        }}
      >
        <Container
          component={MotionContainer}
          sx={{
            py: 3,
            gap: 5,
            zIndex: 9,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            [theme.breakpoints.up(mdKey)]: {
              flex: '1 1 auto',
              justifyContent: 'center',
              py: 'var(--layout-header-desktop-height)',
            },
          }}
        >
          <Stack spacing={3} sx={{ textAlign: 'center' }}>
            <m.div style={{ y: y1 }}>{renderHeading}</m.div>
            <m.div style={{ y: y2 }}>{renderText}</m.div>
          </Stack>
          <m.div style={{ y: y3 }}>{renderExperience}</m.div>
          <m.div style={{ y: y4 }}>{renderButtons}</m.div>
          <m.div style={{ y: y5 }}>{renderTech}</m.div>
        </Container>

        <HeroBackground />
      </Box>
    </Stack>
  );
}
