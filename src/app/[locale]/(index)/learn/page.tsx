import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import { toAppLocale } from "src/i18n/locales";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getTranslations } from "next-intl/server";
import { RouterLink } from "src/routes/components";
import { localizedPageMetadata } from "src/utils/seo-alternates";
import { SERIES_SECTION_ID } from "src/sections/home/home-series/const";
import { SERIES_LESSONS } from "src/sections/home/home-series/data/lessons";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.learn" });
  const title = t("title");
  const description = t("description");
  const path = `${paths.learn.root}/`;

  return localizedPageMetadata(toAppLocale(locale), path, {
    title,
    description,
  });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const language = toAppLocale(locale);
  const t = await getTranslations({ locale, namespace: "home.learn" });

  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={3}>
        <Typography component="h1" variant="h1">
          {t("title")}
        </Typography>
        <Typography>{t("description")}</Typography>
        <RouterLink href={`/#${SERIES_SECTION_ID}`}>{t("map")}</RouterLink>
        <Stack component="ol" spacing={2} sx={{ m: 0, pl: 3 }}>
          {SERIES_LESSONS.map((lesson) => (
            <li key={lesson.slug}>
              <RouterLink href={paths.learn.details(lesson.slug)}>
                {lesson.title[language]}
              </RouterLink>
            </li>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
