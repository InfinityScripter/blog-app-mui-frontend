// Filter chips for the landing feed are NOT hardcoded — they are derived from
// the tags that actually exist on published posts (see `useFeedTags`). The feed
// (Лента) is COMMON: it lists every published post — news and blog alike —
// newest first. Type-specific views live at /news and /post.

// How many posts to show before the "Показать ещё" button; each click adds
// this many more. Not infinite scroll by design.
export const FEED_PAGE_SIZE = 10;

// Section copy.
export const FEED_TITLE = "Лента";
export const FEED_SUBTITLE =
  "Всё самое свежее: новости, разборы и заметки — по порядку";
export const FEED_EMPTY_TEXT = "Пока нет публикаций по выбранным темам.";
export const FEED_SHOW_MORE = "Показать ещё";
