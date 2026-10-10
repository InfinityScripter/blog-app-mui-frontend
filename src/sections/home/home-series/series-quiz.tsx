import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import { monoLabelSx } from "src/theme/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { quizPose } from "./utils";
import { QUIZ_POSES } from "./const";
import { QuizBody } from "./quiz-body";
import { HostPose } from "../components/host-pose";
import { useSeriesQuiz } from "./hooks/use-series-quiz";

// ----------------------------------------------------------------------

const STAMP_CIRCUMFERENCE = 2 * Math.PI * 44;

export function HomeSeriesQuiz() {
  const t = useTranslations("home");
  const quiz = useSeriesQuiz();
  const pose = quizPose({
    phase: quiz.phase,
    index: quiz.index,
    score: quiz.score,
    total: quiz.total,
    answer: quiz.current?.question.answer,
    picked: quiz.picked,
  });

  return (
    <Box component="section" className="ls-lime light ls-grain">
      <Container>
        <Grid
          container
          spacing={{ xs: 4, md: 6 }}
          sx={{ alignItems: "center" }}
        >
          <Grid size={{ xs: 12, md: 5 }}>
            <Box className="ls-quiz-host">
              <HostPose
                poses={QUIZ_POSES}
                active={pose}
                alt={t("quiz.hostAlt")}
              />
              <svg className="ls-stamp" viewBox="0 0 120 120" aria-hidden>
                <defs>
                  <path
                    id="ls-stamp-circle"
                    d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
                  />
                </defs>
                <circle cx="60" cy="60" r="58" />
                <text>
                  <textPath
                    href="#ls-stamp-circle"
                    textLength={STAMP_CIRCUMFERENCE}
                    lengthAdjust="spacing"
                  >
                    {t("quiz.stamp")}
                  </textPath>
                </text>
              </svg>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={3} className="ls-quiz-card">
              <Typography component="p" sx={monoLabelSx}>
                {t("quiz.overline")}
              </Typography>
              <Typography component="h2" className="ls-display-xl">
                {t("quiz.title")}
              </Typography>
              <QuizBody quiz={quiz} />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
