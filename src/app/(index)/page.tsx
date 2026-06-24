import { HomeView } from "src/sections/home/view";

// ----------------------------------------------------------------------

// JSON-LD structured data: lets Google/Yandex build a richer snippet (and a
// Knowledge-panel / sitelinks-search-box) instead of guessing from page text.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Михаил Талалаев",
      alternateName: "Mihail Talalaev",
      url: "https://talalaev.su/",
      jobTitle: "Software Engineer",
      knowsAbout: ["React", "Next.js", "TypeScript", "Веб-разработка"],
    },
    {
      "@type": "WebSite",
      name: "Mihail Talalaev",
      url: "https://talalaev.su/",
      inLanguage: "ru-RU",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://talalaev.su/post/?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

// `title.absolute` opts out of the root template (`%s | Mihail Talalaev`) so
// the homepage title isn't doubled. ~60 chars, keyword-first, brand framing.
// Description ~150 chars in Russian (the audience is рунет) with the core
// keywords search engines rank for.
export const metadata = {
  title: {
    absolute:
      "Михаил Талалаев — Software Engineer · React, Next.js, TypeScript",
  },
  description:
    "Михаил Талалаев — Software Engineer с 13+ годами опыта. Блог и портфолио: статьи о веб-разработке, React, Next.js и TypeScript, пет-проекты и контакты.",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <HomeView />
    </>
  );
}
