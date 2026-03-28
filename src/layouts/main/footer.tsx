import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import { Logo } from "src/components/logo";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";
import { SocialIcon } from "src/components/iconify";

// ----------------------------------------------------------------------

const LINKS = [
  {
    headline: "Разделы",
    children: [{ name: "Вопросы и ответы", href: paths.faqs }],
  },
  {
    headline: "Документы",
    children: [
      { name: "Условия использования", href: "#" },
      { name: "Политика конфиденциальности", href: "#" },
    ],
  },
  {
    headline: "Контакты",
    children: [
      {
        name: "talalaev.misha@gmail.com",
        href: "mailto:talalaev.misha@gmail.com",
      },
    ],
  },
];

const socials = [
  {
    value: "telegram",
    name: "Telegram",
    path: "https://t.me/sh0ny/",
  },
  {
    value: "github",
    name: "GitHub",
    path: "https://github.com/InfinityScripter",
  },
  {
    value: "linkedin",
    name: "Linkedin",
    path: "https://www.linkedin.com/in/talalaevs/",
  },
  {
    value: "vk",
    name: "VK",
    path: "https://vk.com/sh0ny",
  },
];

// ----------------------------------------------------------------------

export function Footer({ layoutQuery, sx }) {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{ position: "relative", bgcolor: "background.default", ...sx }}
    >
      <Divider />

      <Container
        sx={{
          pb: 5,
          pt: 10,
          textAlign: "center",
          [theme.breakpoints.up(layoutQuery)]: { textAlign: "unset" },
        }}
      >
        <Logo />

        <Grid
          container
          sx={{
            mt: 3,
            justifyContent: "center",
            [theme.breakpoints.up(layoutQuery)]: {
              justifyContent: "space-between",
            },
          }}
        >
          <Grid {...{ xs: 12, [layoutQuery]: 3 }}>
            <Typography
              variant="body2"
              sx={{
                mx: "auto",
                maxWidth: 280,
                [theme.breakpoints.up(layoutQuery)]: { mx: "unset" },
              }}
            >
              Блог и портфолио по frontend-разработке. Для связи удобнее всего
              использовать соцсети ниже.
            </Typography>

            <Stack
              direction="row"
              sx={{
                mt: 3,
                mb: 5,
                justifyContent: "center",
                [theme.breakpoints.up(layoutQuery)]: {
                  mb: 0,
                  justifyContent: "flex-start",
                },
              }}
            >
              {socials.map((social) => (
                <IconButton
                  key={social.name}
                  href={social.path}
                  target="_blank"
                >
                  <SocialIcon icon={social.name} />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          <Grid {...{ xs: 12, [layoutQuery]: 6 }}>
            <Stack
              spacing={5}
              sx={{
                flexDirection: "column",
                [theme.breakpoints.up(layoutQuery)]: { flexDirection: "row" },
              }}
            >
              {LINKS.map((list) => (
                <Stack
                  key={list.headline}
                  spacing={2}
                  sx={{
                    width: 1,
                    alignItems: "center",
                    [theme.breakpoints.up(layoutQuery)]: {
                      alignItems: "flex-start",
                    },
                  }}
                >
                  <Typography component="div" variant="overline">
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <Link
                      key={link.name}
                      component={RouterLink}
                      href={link.href}
                      color="inherit"
                      variant="body2"
                    >
                      {link.name}
                    </Link>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 10 }}>
          © All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function HomeFooter({ sx }) {
  return (
    <Box
      component="footer"
      sx={{
        py: 5,
        textAlign: "center",
        position: "relative",
        bgcolor: "background.default",
        ...sx,
      }}
    >
      <Container>
        <Logo />
        <Box sx={{ mt: 1, typography: "caption" }}>
          © All rights reserved.
          <br /> сделано
          <Link href="https://t.me/sh0ny/"> Mikhail Talalaev </Link>
        </Box>
      </Container>
    </Box>
  );
}
