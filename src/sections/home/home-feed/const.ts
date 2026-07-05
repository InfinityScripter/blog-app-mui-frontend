// Filter chips for the landing feed are NOT hardcoded — they are derived from
// the tags that actually exist on published posts (see `useFeedTags`). The feed
// (Лента) is COMMON: it lists every published post — news and blog alike —
// newest first. Type-specific views live at /news and /post.

// How many posts to show initially; each next page adds this many more. The
// page is revealed automatically on scroll (an IntersectionObserver sentinel,
// see `useFeedInfiniteScroll`) and also via the "Показать ещё" fallback button.
export const FEED_PAGE_SIZE = 10;

// Высота (px) невидимого sentinel над кнопкой «Показать ещё». Это зона
// упреждения: чем больше, тем раньше (выше по странице) начинается авто-
// подгрузка следующей порции, чтобы читатель не упирался в конец списка.
export const FEED_SENTINEL_PRELOAD = 400;

// Max filter chips shown in the row. Tags are frequency-ranked, so the most
// common topics win the slots; rarer tags are dropped to keep the row short
// (the full tag set lives on each post, not in the filter bar). A currently
// selected tag is always kept even if it ranks below this cap.
export const FEED_TAGS_LIMIT = 12;

// Section copy.
export const FEED_OVERLINE = "Свежее";
export const FEED_TITLE = "Лента";
export const FEED_SUBTITLE =
  "Всё самое свежее: новости, разборы и заметки — по порядку";
export const FEED_EMPTY_TEXT = "Пока нет публикаций по выбранным темам.";
export const FEED_SHOW_MORE = "Показать ещё";
