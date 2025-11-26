import { m } from "framer-motion";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

import { Iconify } from "src/components/iconify";
import { varFade, MotionViewport } from "src/components/animate";

// ----------------------------------------------------------------------

const EDUCATION = [
  {
    school: "Яндекс Практикум",
    degree: "Школа разработки интерфейсов",
    year: "2021",
    description:
      "Профессиональная программа обучения frontend-разработке с фокусом на современные технологии и практики.",
    icon: "mdi:school",
  },
  {
    school: "Тюменский государственный нефтегазовый университет",
    degree:
      "Специалист, Автоматизированные системы обработки информации и управления",
    year: "2007 - 2012",
    description:
      "Изучение информационных технологий, программирования, баз данных и систем управления.",
    icon: "mdi:school",
  },
];

export default function HomeEducation() {
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
          <Typography variant="h2">Образование</Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography sx={{ color: "text.secondary" }}>
            Мой образовательный путь и профессиональное развитие
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
      >
        {EDUCATION.map((item) => (
          <m.div key={item.school} variants={varFade().inUp}>
            <Card
              sx={{
                boxShadow: theme.customShadows.z8,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: theme.customShadows.z24,
                },
              }}
            >
              <CardContent
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 280,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ mb: 3 }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "50%",
                      bgcolor: theme.palette.primary.lighter,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Iconify
                      icon={item.icon}
                      width={24}
                      sx={{ color: theme.palette.primary.main }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "text.primary" }}
                    >
                      {item.year}
                    </Typography>
                  </Box>
                </Stack>

                <Typography variant="h5" gutterBottom>
                  {item.school}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 2 }}
                >
                  {item.degree}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    flexGrow: 1,
                  }}
                >
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </m.div>
        ))}
      </Box>
    </Container>
  );
}
