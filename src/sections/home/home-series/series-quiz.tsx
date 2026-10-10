import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useTranslations } from "next-intl";
import { hairline } from "src/theme/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { QuestionCard } from "./question-card";
import { useSeriesQuiz } from "./hooks/use-series-quiz";

// ----------------------------------------------------------------------

export function HomeSeriesQuiz() {
  const t = useTranslations("home");
  const quiz = useSeriesQuiz();

  return (
    <Container component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Box
        sx={{
          maxWidth: 720,
          mx: "auto",
          p: { xs: 3, md: 5 },
          borderRadius: 2.5,
          bgcolor: "background.paper",
          border: (theme) => hairline(theme),
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h3" component="h2">
            {t("quiz.title")}
          </Typography>

          {quiz.phase === "intro" && (
            <>
              <Typography sx={{ color: "text.secondary" }}>
                {t("quiz.text")}
              </Typography>
              <Button
                color="primary"
                variant="contained"
                size="large"
                onClick={quiz.start}
                sx={{ alignSelf: "flex-start" }}
              >
                {t("quiz.start")}
              </Button>
            </>
          )}

          {quiz.phase === "question" && quiz.current && (
            <>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {t("series.questionOf", {
                  current: quiz.index + 1,
                  total: quiz.total,
                })}
              </Typography>
              <QuestionCard
                key={quiz.current.question.id}
                item={quiz.current}
                picked={quiz.picked}
                onPick={quiz.pick}
              />
              <Button
                color="primary"
                variant="contained"
                disabled={quiz.picked === undefined}
                onClick={quiz.next}
                sx={{ alignSelf: "flex-start" }}
              >
                {t("series.next")}
              </Button>
            </>
          )}

          {quiz.phase === "result" && (
            <>
              <Typography variant="h2" component="p">
                {t("quiz.result", { score: quiz.score, total: quiz.total })}
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                {quiz.score === quiz.total
                  ? t("quiz.resultAll")
                  : t("quiz.resultSome")}
              </Typography>
              <Button
                color="primary"
                variant="outlined"
                onClick={quiz.start}
                sx={{ alignSelf: "flex-start" }}
              >
                {t("quiz.again")}
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Container>
  );
}
