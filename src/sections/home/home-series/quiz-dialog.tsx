import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useTranslations } from "next-intl";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import { QuizBody } from "./quiz-body";
import { useSeriesQuiz } from "./hooks/use-series-quiz";

// ----------------------------------------------------------------------

interface QuizDialogProps {
  onClose: () => void;
}

export function QuizDialog({ onClose }: QuizDialogProps) {
  const t = useTranslations("home");
  const quiz = useSeriesQuiz();

  return (
    <Dialog open fullWidth maxWidth="sm" onClose={onClose}>
      <DialogTitle>{t("quiz.title")}</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <QuizBody quiz={quiz} />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          {t("series.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
