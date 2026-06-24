import { HomeView } from "src/sections/home/view";

// ----------------------------------------------------------------------

// JSON-LD structured data: lets Google/Yandex build a richer snippet (and a
// Knowledge-panel / sitelinks-search-box) instead of guessing from page text.
// The site is an AI-driven news aggregator; Mihail Talalaev is its author.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Talalaev — AI-агрегатор новостей",
      url: "https://talalaev.su/",
      inLanguage: "ru-RU",
      description:
        "AI-агрегатор новостей: нейросеть собирает, фильтрует и кратко пересказывает свежие новости технологий и AI.",
      author: {
        "@type": "Person",
        name: "Михаил Талалаев",
        alternateName: "Mihail Talalaev",
        jobTitle: "Software Engineer",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://talalaev.su/news/?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Person",
      name: "Михаил Талалаев",
      alternateName: "Mihail Talalaev",
      url: "https://talalaev.su/",
      jobTitle: "Software Engineer",
      knowsAbout: ["AI", "React", "Next.js", "TypeScript", "Веб-разработка"],
    },
  ],
};

// `title.absolute` opts out of the root template (`%s | Mihail Talalaev`) so
// the homepage title isn't doubled. ~55 chars, keyword-first, product-framed.
// The site is an AI news aggregator; the author (Mihail Talalaev) is secondary.
// Description ~155 chars in Russian (audience is рунет) with the core keywords.
export const metadata = {
  title: {
    absolute: "Talalaev — AI-агрегатор новостей технологий и IT",
  },
  description:
    "AI-агрегатор новостей: нейросеть собирает и кратко пересказывает свежие новости технологий, IT и искусственного интеллекта. Автор — Михаил Талалаев.",
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
