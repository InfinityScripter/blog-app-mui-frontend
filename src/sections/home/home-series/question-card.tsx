import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useTranslations } from "next-intl";
import Typography from "@mui/material/Typography";
import { useAppLocale } from "src/hooks/use-app-locale";

import type { QuizItem } from "./types";

// ----------------------------------------------------------------------

interface QuestionCardProps {
  item: QuizItem;
  picked?: boolean;
  onPick: (value: boolean) => void;
}

export function QuestionCard({ item, picked, onPick }: QuestionCardProps) {
  const t = useTranslations("home.series");
  const locale = useAppLocale();
  const answered = picked !== undefined;
  const correct = picked === item.question.answer;

  return (
    <Stack spacing={2}>
      <Typography variant="h5" component="p">
        {item.question.text[locale]}
      </Typography>

      <Stack direction="row" spacing={1.5}>
        <Button
          color="primary"
          variant={picked === true ? "contained" : "outlined"}
          disabled={answered}
          onClick={() => onPick(true)}
        >
          {t("yes")}
        </Button>
        <Button
          color="primary"
          variant={picked === false ? "contained" : "outlined"}
          disabled={answered}
          onClick={() => onPick(false)}
        >
          {t("no")}
        </Button>
      </Stack>

      {answered && (
        <Typography variant="body2" role="status">
          <Box
            component="strong"
            sx={{ color: correct ? "success.main" : "error.main" }}
          >
            {correct ? t("correct") : t("wrong")}
          </Box>{" "}
          {item.question.why[locale]}{" "}
          {item.lesson.reelUrl && (
            <Link
              href={item.lesson.reelUrl}
              target="_blank"
              rel="noopener"
              underline="always"
            >
              {t("reelLink", { number: item.lesson.number })}
            </Link>
          )}
        </Typography>
      )}
    </Stack>
  );
}
