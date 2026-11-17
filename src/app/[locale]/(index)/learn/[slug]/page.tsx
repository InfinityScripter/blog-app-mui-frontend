import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import { notFound } from "next/navigation";
import { toAppLocale } from "src/i18n/locales";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getTranslations } from "next-intl/server";
import { RouterLink } from "src/routes/components";
import { localizedPageMetadata } from "src/utils/seo-alternates";
import { SERIES_SECTION_ID } from "src/sections/home/home-series/const";
import { SERIES_LESSONS } from "src/sections/home/home-series/data/lessons";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return SERIES_LESSONS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const language = toAppLocale(locale);
  const lesson = SERIES_LESSONS.find((item) => item.slug === slug);
  if (!lesson) notFound();

  const title = lesson.title[language];
  const description = lesson.intro[language];
  const path = `${paths.learn.details(lesson.slug)}/`;

  return localizedPageMetadata(language, path, { title, description });
}

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;
  const language = toAppLocale(locale);
  const index = SERIES_LESSONS.findIndex((item) => item.slug === slug);
  const lesson = SERIES_LESSONS[index];
  if (!lesson) notFound();

  const [t, series] = await Promise.all([
    getTranslations({ locale, namespace: "home.learn" }),
    getTranslations({ locale, namespace: "home.series" }),
  ]);
  const previous = SERIES_LESSONS[index - 1];
  const next = SERIES_LESSONS[index + 1];

  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack component="article" spacing={4}>
        <RouterLink href={paths.learn.root}>{t("all")}</RouterLink>

        <Typography component="h1" variant="h1">
          {lesson.title[language]}
        </Typography>

        <Typography>{lesson.intro[language]}</Typography>

        {lesson.reelUrl && <Link href={lesson.reelUrl}>{series("watch")}</Link>}

        {lesson.questions.map((question) => (
          <Stack component="section" key={question.id} spacing={1}>
            <Typography component="h2" variant="h5">
              {question.text[language]}
            </Typography>
            <Typography>{question.why[language]}</Typography>
          </Stack>
        ))}

        <RouterLink href={`/#${SERIES_SECTION_ID}`}>{t("map")}</RouterLink>

        <Stack component="nav" aria-label={t("navigation")} spacing={2}>
          {previous && (
            <RouterLink href={paths.learn.details(previous.slug)}>
              {t("previous")} — {previous.title[language]}
            </RouterLink>
          )}
          {next && (
            <RouterLink href={paths.learn.details(next.slug)}>
              {t("next")} — {next.title[language]}
            </RouterLink>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}
