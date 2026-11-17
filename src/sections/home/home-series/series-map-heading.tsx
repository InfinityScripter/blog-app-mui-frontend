import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import Button from "@mui/material/Button";
import { useTranslations } from "next-intl";
import { monoLabelSx } from "src/theme/styles";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";

import { SERIES_LESSONS } from "./data/lessons";

// ----------------------------------------------------------------------

interface SeriesMapHeadingProps {
  passed: number;
  onQuiz: () => void;
}

export function SeriesMapHeading({ passed, onQuiz }: SeriesMapHeadingProps) {
  const t = useTranslations("home.series");
  const learn = useTranslations("home.learn");
  const stats = [
    { value: SERIES_LESSONS.length, label: t("statLevels") },
    { value: 1, label: t("statMinutes") },
    { value: SERIES_LESSONS[0].questions.length, label: t("statQuestions") },
  ];

  return (
    <Box className="ls-night__head">
      <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
        <Typography component="p" sx={monoLabelSx} className="ls-accent-teal">
          {t("overline")}
        </Typography>
        <Typography component="h2" className="ls-display-xl">
          {t("titleLead")}
          <Box component="em" className="ls-accent-lime">
            {t("titleAccent")}
          </Box>
        </Typography>
      </Stack>

      <Stack spacing={3}>
        <Typography sx={{ color: "text.secondary", maxWidth: "52ch" }}>
          {t("subtitle")}
        </Typography>
        <Stack direction="row" spacing={4} useFlexGap sx={{ flexWrap: "wrap" }}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <span className="ls-stat">{stat.value}</span>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {stat.label}
              </Typography>
            </div>
          ))}
        </Stack>
        <Typography variant="subtitle2">
          {t("progress", { passed, total: SERIES_LESSONS.length })}
        </Typography>
        <Button
          color="primary"
          variant="outlined"
          className="ls-sticker-btn"
          onClick={onQuiz}
          sx={{ alignSelf: "flex-start" }}
        >
          {t("quizButton")}
        </Button>
        <Button
          component={RouterLink}
          href={paths.learn.root}
          color="primary"
          variant="outlined"
          sx={{ alignSelf: "flex-start" }}
        >
          {learn("read")}
        </Button>
      </Stack>
    </Box>
  );
}
