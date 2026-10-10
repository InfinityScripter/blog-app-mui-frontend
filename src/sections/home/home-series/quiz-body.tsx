import Button from "@mui/material/Button";
import { useTranslations } from "next-intl";
import Typography from "@mui/material/Typography";

import { QuestionCard } from "./question-card";

import type { useSeriesQuiz } from "./hooks/use-series-quiz";

// ----------------------------------------------------------------------

interface QuizBodyProps {
  quiz: ReturnType<typeof useSeriesQuiz>;
}

export function QuizBody({ quiz }: QuizBodyProps) {
  const t = useTranslations("home");

  if (quiz.phase === "intro") {
    return (
      <>
        <Typography sx={{ color: "text.secondary" }}>
          {t("quiz.text")}
        </Typography>
        <Button
          color="primary"
          variant="contained"
          size="large"
          className="ls-sticker-btn"
          onClick={quiz.start}
          sx={{ alignSelf: "flex-start" }}
        >
          {t("quiz.start")}
        </Button>
      </>
    );
  }

  if (quiz.phase === "question" && quiz.current) {
    return (
      <>
        <div className="ls-quiz-dots" aria-hidden>
          {Array.from({ length: quiz.total }, (_, index) => (
            <i key={index} data-on={index <= quiz.index} />
          ))}
        </div>
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
          className="ls-sticker-btn"
          disabled={quiz.picked === undefined}
          onClick={quiz.next}
          sx={{ alignSelf: "flex-start" }}
        >
          {t("series.next")}
        </Button>
      </>
    );
  }

  return (
    <>
      <Typography component="p" className="ls-display-xl">
        {t("quiz.result", { score: quiz.score, total: quiz.total })}
      </Typography>
      <Typography sx={{ color: "text.secondary" }}>
        {quiz.score === quiz.total ? t("quiz.resultAll") : t("quiz.resultSome")}
      </Typography>
      <Button
        color="primary"
        variant="outlined"
        className="ls-sticker-btn"
        onClick={quiz.start}
        sx={{ alignSelf: "flex-start", bgcolor: "background.default" }}
      >
        {t("quiz.again")}
      </Button>
    </>
  );
}
