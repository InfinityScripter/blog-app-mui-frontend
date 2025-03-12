import { m } from "framer-motion";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";

import { Iconify } from "src/components/iconify";
import { varFade, MotionViewport } from "src/components/animate";

// ----------------------------------------------------------------------

const LANGUAGES = [
  {
    name: "Русский",
    level: "Родной",
    proficiency: 100,
    icon: "emojione:flag-for-russia",
  },
  {
    name: "Английский",
    level: "B2 — Средне-продвинутый",
    proficiency: 75,
    icon: "emojione:flag-for-united-kingdom",
  },
];

const RECOMMENDATIONS = [
  {
    company: 'ООО "СТОМПЛАН"',
    person: "Максим Здобнов",
    position: "СЕО",
  },
  {
    company: "Яндекс",
    person: "Евгений Лоситский",
    position: "Старший разработчик",
  },
  {
    company: "QCup",
    person: "Дмитрий Галкин",
    position: "Тим-лид",
  },
  {
    company: "Shurik market",
    person: "Леонид Михеев",
    position: "Тим-лид",
  },
];

export default function HomeLanguages() {
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
          textAlign: "center",
          mb: { xs: 5, md: 10 },
        }}
      >
        <m.div variants={varFade().inDown}>
          <Typography variant="h2">Languages & Recommendations</Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography sx={{ color: "text.secondary" }}>
            My language proficiency and professional recommendations
          </Typography>
        </m.div>
      </Stack>

      <Box
        gap={4}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
        }}
        sx={{ mb: 8 }}
      >
        <m.div variants={varFade().inLeft}>
          <Card
            sx={{
              height: "100%",
              boxShadow: theme.customShadows.z8,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Languages
              </Typography>

              <Stack spacing={3} sx={{ mt: 3 }}>
                {LANGUAGES.map((language) => (
                  <Stack key={language.name} spacing={1.5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon={language.icon} width={24} />
                      <Typography variant="subtitle1">
                        {language.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", ml: "auto" }}
                      >
                        {language.level}
                      </Typography>
                    </Stack>

                    <LinearProgress
                      variant="determinate"
                      value={language.proficiency}
                      color="primary"
                      sx={{
                        height: 8,
                        bgcolor: theme.palette.background.neutral,
                      }}
                    />
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </m.div>

        <m.div variants={varFade().inRight}>
          <Card
            sx={{
              height: "100%",
              boxShadow: theme.customShadows.z8,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Recommendations
              </Typography>

              <Stack spacing={3} sx={{ mt: 3 }}>
                {RECOMMENDATIONS.map((rec) => (
                  <Stack
                    key={rec.company}
                    spacing={1}
                    direction="row"
                    alignItems="center"
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      bgcolor: theme.palette.background.neutral,
                    }}
                  >
                    <Iconify
                      icon="mdi:account-check"
                      width={24}
                      sx={{ color: theme.palette.primary.main }}
                    />
                    <Box>
                      <Typography variant="subtitle2">{rec.person}</Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {rec.position}, {rec.company}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </m.div>
      </Box>
    </Container>
  );
}
