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
      url: "https://aifirst.us.com/",
      inLanguage: "ru-RU",
      description:
        "AI-first агрегатор новостей: нейросеть (LLM) сама находит, фильтрует и кратко пересказывает свежие новости об искусственном интеллекте, IT и технологиях.",
      keywords:
        "AI-агрегатор, новости AI, искусственный интеллект, нейросеть, LLM, IT-новости, технологии",
      author: {
        "@type": "Person",
        name: "Михаил Талалаев",
        alternateName: "Mihail Talalaev",
        jobTitle: "Software Engineer",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://aifirst.us.com/news/?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Person",
      name: "Михаил Талалаев",
      alternateName: "Mihail Talalaev",
      url: "https://aifirst.us.com/",
      jobTitle: "Software Engineer",
      knowsAbout: [
        "Искусственный интеллект",
        "AI",
        "LLM",
        "React",
        "Next.js",
        "TypeScript",
      ],
    },
  ],
};

// `title.absolute` opts out of the root template (`%s | Mihail Talalaev`) so
// the homepage title isn't doubled. ~55 chars, keyword-first, product-framed.
// The site is an AI news aggregator; the author (Mihail Talalaev) is secondary.
// Description ~155 chars in Russian (audience is рунет) with the core keywords.
export const metadata = {
  title: {
    absolute: "AI-агрегатор новостей: AI, IT и технологии | Talalaev",
  },
  description:
    "AI-first агрегатор новостей: нейросеть (LLM) сама находит, фильтрует и кратко пересказывает свежие новости об искусственном интеллекте, IT и технологиях. Без редактора — лента курируется AI.",
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
