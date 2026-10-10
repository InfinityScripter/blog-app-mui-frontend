import { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useTranslations } from "next-intl";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { useAppLocale } from "src/hooks/use-app-locale";

import { QuestionCard } from "./question-card";

import type { SeriesLesson } from "./types";

// ----------------------------------------------------------------------

interface LevelDialogProps {
  lesson: SeriesLesson;
  onClose: () => void;
  onComplete: (lessonNumber: number) => void;
}

export function LevelDialog({ lesson, onClose, onComplete }: LevelDialogProps) {
  const t = useTranslations("home.series");
  const locale = useAppLocale();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const question = lesson.questions[index];
  const picked: boolean | undefined = answers[index];
  const isLast = index === lesson.questions.length - 1;

  const handleNext = () => {
    if (!isLast) {
      setIndex(index + 1);
      return;
    }
    onComplete(lesson.number);
    onClose();
  };

  return (
    <Dialog open fullWidth maxWidth="sm" onClose={onClose}>
      <DialogTitle>
        {t("level", { number: lesson.number })}: {lesson.title[locale]}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          {lesson.reelUrl ? (
            <Button
              href={lesson.reelUrl}
              target="_blank"
              rel="noopener"
              variant="contained"
              startIcon={<Iconify icon="mingcute:play-fill" />}
              sx={{ alignSelf: "flex-start" }}
            >
              {t("watch")}
            </Button>
          ) : (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {t("soonNote")}
            </Typography>
          )}

          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {t("questionOf", {
              current: index + 1,
              total: lesson.questions.length,
            })}
          </Typography>

          <QuestionCard
            key={question.id}
            item={{ lesson, question }}
            picked={picked}
            onPick={(value) =>
              setAnswers((prev) => [...prev.slice(0, index), value])
            }
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          {t("close")}
        </Button>
        <Button
          variant="contained"
          disabled={picked === undefined}
          onClick={handleNext}
        >
          {isLast ? t("complete") : t("next")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
